import fs from 'fs';
import { join } from "path";
import matter from "gray-matter";
import { processMarkdown, stripMarkdown } from './markdown';

export default class PostCompiler {
  posts: PostData[];
  directory: string;
  slugPattern: RegExp;
  datePattern: RegExp = new RegExp(/\d{4}-\d{2}-\d{2}-/);

  constructor(directory: string, slugPattern: RegExp) {
    this.posts = [];
    this.directory = directory;
    this.slugPattern = slugPattern;
  }

  getPosts() {
    if(this.posts.length > 0) {
      return this.posts;
    }

    const files: PostData[] = this.readFiles()
      .map((dirent): PostData => {
        const { name } = dirent;
        const slug = this.getSlug(name);

        return {
          slug,
          path: name,
          date: this.getDate(name),
          ...this.getContent(name, slug)
        }
      });

    const directories: PostData[] = this.readDirectories()
      .map((dirent): PostData => {
        const { name } = dirent;
        const slug = this.getSlug(name);
        const path = `${name}/index.md`;

        return {
          slug,
          path,
          date: this.getDate(name),
          ...this.getContent(path, slug)
        }
      });

    this.posts = this.sortByDate([...directories, ...files]);

    return this.posts;
  }

  getContentBySlug(slug: string): PostData {
    return this.getPosts().find(post => {
      return post.slug === slug;
    }) || null;
  }

  readFiles() {
    return fs.readdirSync(this.directory, { withFileTypes: true })
      .filter(dirent => dirent.isFile());
  }

  readDirectories() {
    return fs.readdirSync(this.directory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());
  }

  getDate(fileName: string): string {
    return fileName.match(this.datePattern)?.[0]?.replace(/\-$/, "") || "";
  }

  getSlug(fileName: string): string {
    const slugWithFileExtension = this.slugPattern.exec(fileName)?.[1] || "";

    return slugWithFileExtension.replace(/\.md$/, "");
  }

  sortByDate(posts: PostData[]): PostData[] {
    return posts
      .sort((p1, p2) => {
        const date1 = new Date(p1.date);
        const date2 = new Date(p2.date);

        if (date2.getTime() === date1.getTime()) {
          return 0;
        }

        return date2.getTime() < date1.getTime()
          ? -1 : 1;
      });
  }

  getContent(filePath: string, slug: string) {
    const fullPath = join(this.directory, filePath);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const strippedContent = stripMarkdown(content)
      .replace(/\s\s+/g, ' ')
      .replace(/\r?\n|\r/g, '');
    const words = strippedContent.split(' ');
    const excerpt = words.slice(0, 50).join(' ') + '...';

    return {
      content: processMarkdown(content, slug),
      excerpt,
      title: data.title,
      ogImage: data.ogImage || ""
    }
  }
}
