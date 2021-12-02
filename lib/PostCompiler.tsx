import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { processMarkdown, stripMarkdown } from "./markdown";
import AnalyticsService from "./AnalyticsService";
import SupabaseService from "./SupabaseService";

export default class PostCompiler {
  db;
  contentType;
  directory: string;
  slugPattern: RegExp;
  datePattern: RegExp = new RegExp(/\d{4}-\d{2}-\d{2}-/);
  ga: AnalyticsService;

  constructor(
    contentType: ContentType,
    slugPattern: RegExp,
    db = new SupabaseService()
  ) {
    this.db = db;
    this.contentType = contentType;
    this.directory = join(process.cwd(), `_${contentType}s`);
    this.slugPattern = slugPattern;
    this.ga = new AnalyticsService();
  }

  getFilesAndDirectories(slug = ""): {
    type: string;
    content: fs.Dirent;
  }[] {
    const files = this.readFiles().map((content) => {
      return {
        type: "file",
        content,
      };
    });

    const directories = this.readDirectories().map((content) => {
      return {
        type: "directory",
        content,
      };
    });

    const filesAndDirectories = files.concat(directories);

    if (!slug) {
      return filesAndDirectories;
    }

    // Return an array of just that single item.
    return [
      filesAndDirectories.find((thing) => {
        return this.getSlug(thing.content.name) === slug;
      }),
    ].filter((i) => !!i);
  }

  async getPosts(slug = ""): Promise<PostData[]> {
    let posts = this.getFilesAndDirectories(slug).map((fileSystemThing) => {
      const { name } = fileSystemThing.content;
      const slug = this.getSlug(name);
      const path = fileSystemThing.type === "file" ? name : `${name}/index.md`;

      return {
        slug,
        path,
        date: this.getDate(name),
        ...this.getContent(path, slug),
      } as PostData;
    });

    posts = await this.attachViewCounts(posts);

    return this.sortByDate(posts);
  }

  async attachViewCounts(posts): Promise<PostData[]> {
    const postsWithViews = posts.map((post) => {
      post.views = this.ga.getTotalPostViews(post.slug);

      return post;
    });

    const results = await Promise.allSettled(
      postsWithViews.map((p) => p.views)
    );

    (results as unknown as any[]).forEach((result, index) => {
      postsWithViews[index].views = result.value;
    });

    return postsWithViews;
  }

  async getContentBySlug(slug: string): Promise<PostData> {
    return (
      (await this.getPosts(slug)).find((post) => {
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
