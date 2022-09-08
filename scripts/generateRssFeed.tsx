import fs from "fs";
import { Feed } from "feed";
import { DESCRIPTION, MY_NAME, SITE_URL, TITLE } from "../lib/constants";
import CMSService from "../lib/CMSService";
import MarkdownService from "../lib/MarkdownService";
import { BlogPost } from "../types/types";

const generateRssFeed = async (): Promise<{ postCount: number }> => {
  const cmsService = new CMSService();
  const posts = await cmsService.getAllPosts();
  const date = new Date();

  console.log(`Generating RSS feed with ${posts.length} items...`);

  const author = {
    name: MY_NAME,
    link: SITE_URL,
  };

  const feed = new Feed({
    title: TITLE,
    description: DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    image: `${SITE_URL}/open-graph.jpg`,
    favicon: `${SITE_URL}/favicon/apple-touch-icon.png`,
    copyright: `All rights reserved ${date.getFullYear()}, Sreetam Das`,
    updated: date,
    generator: "Feed for Node.js",
    feedLinks: {
      rss2: `${SITE_URL}/rss/feed.xml`,
      json: `${SITE_URL}/rss/feed.json`,
      atom: `${SITE_URL}/rss/atom.xml`,
    },
    author,
  });

  const addToFeedPromises = posts.map((post) => {
    return new Promise<BlogPost>(async (resolve) => {
      try {
        const url = `${SITE_URL}/posts/${post.slug}`;
        const { code } = await new MarkdownService().processMarkdown(
          post.markdown
        );

        feed.addItem({
          title: post.title,
          id: url,
          link: url,
          description: post.description,
          content: code,
          author: [author],
          contributor: [author],
          date: new Date(post.date),
        });

        return resolve(post);
      } catch (e) {
        console.error(`MDX processing failed for ${post.slug}: ${e.message}`);
        return resolve(post);
      }
    });
  });

  await Promise.all(addToFeedPromises);

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());

  console.log("RSS feed generation finished!");

  return {
    postCount: posts.length,
  };
};

export default generateRssFeed;
