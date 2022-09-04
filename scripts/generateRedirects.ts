import fs from "fs";
import * as dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config();

const client = new Client({ auth: process.env.NOTION_TOKEN });
const database = process.env.NOTION_DATABASE_ID ?? "";

const getExternalBlogPosts = async (cursor = undefined) => {
  let allResults = [];

  const response = await client.databases.query({
    database_id: database,
    page_size: 100,
    start_cursor: cursor || undefined,
    filter: {
      property: "External URL",
      rich_text: {
        contains: "https",
      },
    },
  });

  const { next_cursor, has_more, results } = response;

  allResults = allResults.concat(results);

  if (has_more) {
    allResults = allResults.concat(await getExternalBlogPosts(next_cursor));
  }

  return allResults;
};

(async () => {
  interface ExternalUrlPost {
    published: boolean;
    slug: string;
    externalUrl: string;
  }

  const posts = await getExternalBlogPosts();
  const urls: ExternalUrlPost[] = posts
    .map((post) => {
      return {
        published: post.properties.Published.checkbox,
        slug: `/posts/${post.properties.Slug.rich_text[0]?.plain_text}`,
        externalUrl: post.properties["External URL"].rich_text[0]?.plain_text,
      };
    })
    .filter((post) => !!post.published);

  const redirects = urls.map(({ slug, externalUrl }) => {
    return {
      source: slug,
      destination: externalUrl,
      permanent: true,
    };
  });

  fs.writeFileSync("./redirects.json", JSON.stringify(redirects));
})();
