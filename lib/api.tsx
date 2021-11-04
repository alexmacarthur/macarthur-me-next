import { join } from "path";
import chunk from "lodash.chunk";
import PostCompiler from "./PostCompiler";
import imageData from "../lib/image-data.json";

const postsDirectory = join(process.cwd(), "_posts");
const pagesDirectory = join(process.cwd(), "_pages");
const postSlugPattern = new RegExp(/(?:\d{4}-\d{2}-\d{2}-)(.+)(\.mdx?)?/);
const pageSlugPattern = new RegExp(/(.+)(?:\.mdx?)/);

const postCompiler = new PostCompiler(postsDirectory, postSlugPattern);
const pageCompiler = new PostCompiler(pagesDirectory, pageSlugPattern);

const PER_PAGE = 10;

export async function getContentBySlug(slug: string, contentType: ContentType) {
  const compiler = contentType === "post" ? postCompiler : pageCompiler;

  return compiler.getContentBySlug(slug);
}

export async function getAllPosts(): Promise<PostData[]> {
  return postCompiler.getPosts();
}

export async function getPostChunks(): Promise<[]> {
  const posts = await getAllPosts();

  return chunk(posts, PER_PAGE);
}

export async function getPageOfPosts(page: number): Promise<[]> {
  const postChunks = await getPostChunks();

  return postChunks[page - 1];
}

export async function getTotalPostPages(): Promise<number> {
  return (await getPostChunks()).length;
}

export async function getPostPageCount(): Promise<number> {
  return (await getPostChunks()).length;
}

export async function getAllPages(): Promise<PostData[]> {
  return pageCompiler.getPosts();
}

export function getImageDataForSlug(slug: string): { [key: string]: any } {
  return imageData[slug] || {};
}

export async function getTopPosts(limit = 3) {
  const sortedPosts = (await getAllPosts()).sort((a, b) => {
    const numberize = (num: string) => Number(num.replace(/,/g, ""));
    const aViews = a.views || '0';
    const bViews = b.views || '0';

    return numberize(aViews) > numberize(bViews) ? -1 : 1;
  });

  return sortedPosts.slice(0, limit);
}
