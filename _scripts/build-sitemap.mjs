// #!/usr/bin/env node

import { writeFileSync } from "fs";
import * as rimraf from "rimraf";
import { globbySync } from "globby";
import * as prettier from "prettier";

(async () => {
  const pagesDirectory = `${process.cwd()}/.next/server/pages`;
  const prettierConfig = await prettier.default.resolveConfig("./.prettierrc.js");

  rimraf.default.sync(`${process.cwd()}/public/sitemap.xml`);

  const pages = globbySync([
    `${pagesDirectory}/**/*.html`,
    `!${pagesDirectory}/**/404.html`,
  ]);

  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            ${pages
              .map((page) => {
                const path = page
                  .replace(pagesDirectory, "")
                  .replace(".html", "");
                const route = path === "/index" ? "" : path;

                return `
                        <url>
                            <loc>${`https://macarthur.me${route}`}</loc>
                            <changefreq>daily</changefreq>
                        </url>
                    `;
              })
              .join("")}
        </urlset>
    `;

  // If you're not using Prettier, you can remove this.
  const formatted = prettier.default.format(sitemap, {
    ...prettierConfig,
    parser: "html",
  });

  // need to fix this..
  writeFileSync(`${process.cwd()}/.next/sitemap.xml`, formatted);
})();
