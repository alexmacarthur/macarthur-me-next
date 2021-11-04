import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { processMarkdown, stripMarkdown } from "./markdown";
import GoogleAnalyticsService from "./GoogleAnalyticsService";
import JsonDbService from "./JsonDbService";

export default class PostCompiler {
  db;
  directory: string;
  slugPattern: RegExp;
  datePattern: RegExp = new RegExp(/\d{4}-\d{2}-\d{2}-/);
  ga: GoogleAnalyticsService;

  constructor(
    directory: string,
    slugPattern: RegExp,
    db = new JsonDbService()
  ) {
    this.db = db;
    this.directory = directory;
    this.slugPattern = slugPattern;
    this.ga = new GoogleAnalyticsService();
  }

  async getPosts() {
    const cachedPosts = this.db.get("/posts");

    if (cachedPosts) {
      console.log("Found cached posts...");

      return cachedPosts;
    }

    const files: PostData[] = this.readFiles().map((dirent): PostData => {
      const { name } = dirent;
      const slug = this.getSlug(name);

      return {
        slug,
        path: name,
        date: this.getDate(name),
        ...this.getContent(name, slug),
      };
    });

    const directories: PostData[] = this.readDirectories().map(
      (dirent): PostData => {
        const { name } = dirent;
        const slug = this.getSlug(name);
        const path = `${name}/index.md`;

        return {
          slug,
          path,
          date: this.getDate(name),
          ...this.getContent(path, slug),
        };
      }
    );

    let posts = await this.attachGaViews([...directories, ...files]);
    posts = this.sortByDate(posts);

    console.log("Saving posts to cache...");
    this.db.push("/posts", posts);

    return posts;
  }

  async attachGaViews(posts): Promise<PostData[]> {
    for (const post of posts) {
      // Hack to get around GA rate limiting.
      await new Promise((resolve) => {
        setTimeout(
          async () => {
            resolve(null);
          },
          process.env.NODE_ENV === "production" ? 250 : 0
        );
      });

      post.views = await this.ga.getPostViews(post.slug);
    }

    return posts;
  }

  async getContentBySlug(slug: string): Promise<PostData> {
    return (
      (await this.getPosts()).find((post) => {
        return post.slug === slug;
      }) || null
    );
  }

  readFiles() {
    return fs
      .readdirSync(this.directory, { withFileTypes: true })
      .filter((dirent) => dirent.isFile() && !/^\..*/.test(dirent.name));
  }

  readDirectories() {
    return fs
      .readdirSync(this.directory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory());
  }

  getDate(fileName: string): string {
    return fileName.match(this.datePattern)?.[0]?.replace(/\-$/, "") || "";
  }

  getSlug(fileName: string): string {
    const slugWithFileExtension = this.slugPattern.exec(fileName)?.[1] || "";

    return slugWithFileExtension.replace(/\.md$/, "");
  }

  sortByDate(posts: PostData[]): PostData[] {
    return posts.sort((p1, p2) => {
      const date1 = new Date(p1.date);
      const date2 = new Date(p2.date);

      if (date2.getTime() === date1.getTime()) {
        return 0;
      }

      return date2.getTime() < date1.getTime() ? -1 : 1;
    });
  }

  getContent(filePath: string, slug: string) {
    const fullPath = join(this.directory, filePath);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const strippedContent = stripMarkdown(content)
      .replace(/\s\s+/g, " ")
      .replace(/\r?\n|\r/g, "")
      .replace(/\S+\.(gif|png|jpe?g)/g, ""); // Remove images.
    const words = strippedContent.split(" ");
    const excerpt = words.slice(0, 50).join(" ") + "...";

    return {
      content: processMarkdown(content, slug),
      excerpt,
      title: data.title,
      lastUpdated: data.lastUpdated || "",
      subTitle: data.subTitle || "",
      ogImage: data.ogImage || "",
      external: data.external || "",
      externalDomain: data.external
        ? new URL(data.external).host.replace(/^www\./, "")
        : "",
    };
  }
}
