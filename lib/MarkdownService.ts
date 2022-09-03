import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import path, { join } from "path";
import fs from "fs";
import getConfig from "next/config";
import { ContentEntity } from "../types/types";
import { generateExcerptFromMarkdown } from "./markdown";
const { serverRuntimeConfig } = getConfig();

if (process.platform === "win32") {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "esbuild.exe"
  );
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "bin",
    "esbuild"
  );
}

const CodepenTransformer = {
  name: "Codepen",

  shouldTransform(url) {
    const { host, pathname } = new URL(url);

    return ["codepen.io"].includes(host) && pathname.includes("/pen/");
  },

  getHTML(url) {
    const [, username, id] = url.match(/codepen\.io\/(.+)\/pen\/(.+)/);

    return `
      <div>
        <p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="${id}" data-user="${username}" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
          <span><a href="${url}">See the Pen</a> on <a href="https://codepen.io">CodePen</a>.</span>
        </p>
      </div>
    `;
  },
};

class MarkdownSerivce {
  pageDirectory: string;

  constructor() {
    this.pageDirectory = join(serverRuntimeConfig.PROJECT_ROOT, `_pages`);
  }

  async processMarkdown(rawMarkdown: string): Promise<{
    code: string;
    frontmatter: any;
  }> {
    const [remarkPlugins, rehypePlugins] = await this.getMarkdownPlugins();

    return await bundleMDX({
      source: rawMarkdown,
      mdxOptions: (options) => ({
        remarkPlugins: [...(options.remarkPlugins ?? []), ...remarkPlugins],
        rehypePlugins: [...(options.rehypePlugins ?? []), ...rehypePlugins],
      }),
    });
  }

  private async getMarkdownPlugins() {
    const { default: remarkEmbedder } = require("@remark-embedder/core");

    const remarkPlugins = await Promise.all([
      import("remark-prism").then((mod) => mod.default),
      import("remark-gfm").then((mod) => mod.default),
      Promise.resolve(() =>
        remarkEmbedder({ transformers: [CodepenTransformer] })
      ),
    ]);

    const rehypePlugins = await Promise.all([
      import("rehype-slug").then((mod) => mod.default),
      import("rehype-autolink-headings").then((mod) => mod.default),
      import("rehype-external-links").then((mod) => mod.default),
    ]);

    return [remarkPlugins, rehypePlugins];
  }

  getPage(slug: string): ContentEntity {
    const fullPath = join(this.pageDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontmatterData, content } = matter(fileContents);

    return {
      slug,
      markdown: content,
      description: generateExcerptFromMarkdown(content),
      title: frontmatterData.title,
      subtitle: frontmatterData.subTitle || "",
      openGraphImage: frontmatterData.openGraphImage || "",
    };
  }

  getAllPageSlugs(): string[] {
    const pageFiles = fs.readdirSync(this.pageDirectory);

    return pageFiles.map((file) => file.replace(/.md$/, ""));
  }

  async getAllPages(): Promise<ContentEntity[]> {
    return this.getAllPageSlugs().map(this.getPage.bind(this));
  }
}

export default MarkdownSerivce;
