import { writeFileSync } from "fs";
import * as rimraf from "rimraf";
import * as prettier from "prettier";
import CMSService from "../lib/CMSService";
import MarkdownService from "../lib/MarkdownService";
import { SITE_URL } from "../lib/constants";

const formUrl = (slug) => {
  return `${SITE_URL}/${slug}`.replace(/\/$/, "");
};

const generateSitemap = async (): Promise<{
  postCount: number;
  pageCount: number;
}> => {
  const cmsService = new CMSService();
  const markdownService = new MarkdownService();

  const posts = await cmsService.getAllPosts(false);
  const pages = await markdownService.getAllPages();

  const postLinks: string[] = posts.map((p) => formUrl(`posts/${p.slug}`));
  const pageLinks: string[] = pages.map((p) => formUrl(p.slug));
  const allLinks = postLinks.concat(pageLinks);

  rimraf.default.sync(`${process.cwd()}/public/sitemap.xml`);

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            ${allLinks
              .map((url) => {
                return `
                        <url>
                            <loc>${url}</loc>
                            <changefreq>daily</changefreq>
                        </url>
                    `;
              })
              .join("")}
        </urlset>
    `;

  const formatted = prettier.default.format(sitemap, {
    parser: "html",
  });

  writeFileSync(`${process.cwd()}/public/sitemap.xml`, formatted);

  console.log("Sitemap complete!");

  return {
    postCount: postLinks.length,
    pageCount: pageLinks.length,
  };
};

export default generateSitemap;
