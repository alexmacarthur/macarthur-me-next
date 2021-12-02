// #!/usr/bin/env node

import { writeFileSync } from "fs";
import * as rimraf from "rimraf";
import { globbySync } from "globby";
import * as prettier from "prettier";

(async () => {
  rimraf.default.sync(`${process.cwd()}/public/sitemap.xml`);

  const postLinks = globbySync([`${process.cwd()}/_posts/**/*.md`]).map(
    (post) => {
      return `posts/${
        post.match(/(?:\d{4}-\d{2}-\d{2}-)(.+?)((?=(\/index)|(?=\.md)))/)[1]
      }`;
    }
  );

  const pageLinks = globbySync([
    `${process.cwd()}/_pages/**/*.md`,
    `${process.cwd()}/pages/**/*.tsx`,
  ])
    .filter((page) => {
      if (page.match(/\[|\]/)) return false;
      if (page.match(/pages\/_/)) return false;

      return true;
    })
    .map((page) => {
      const pageSlug = page.match(
        /(?:pages\/)(.+?)((?=(\/index)|(?=\.(tsx|md))))/
      )[1];

      if (pageSlug.match(/^index$/)) return "";

      return pageSlug;
    });

  const allLinks = postLinks.concat(pageLinks);

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            ${allLinks
              .map((slug) => {
                const url = `https://macarthur.me/${slug}`.replace(/\/$/, "");

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
})();
