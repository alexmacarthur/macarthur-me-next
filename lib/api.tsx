import { join } from "path";
import chunk from 'lodash.chunk';
import PostCompiler from "./PostCompiler";
import imageData from "../lib/image-data.json";

const postsDirectory = join(process.cwd(), "_posts");
const pagesDirectory = join(process.cwd(), "_pages");
const postSlugPattern = new RegExp(/(?:\d{4}-\d{2}-\d{2}-)(.+)(\.mdx?)?/);
const pageSlugPattern = new RegExp(/(.+)(?:\.mdx?)/);

const postCompiler = new PostCompiler(postsDirectory, postSlugPattern)
const pageCompiler = new PostCompiler(pagesDirectory, pageSlugPattern);

const PER_PAGE = 5;

export function getContentBySlug(slug: string, contentType: ContentType) {
  const compiler = contentType === "post" ? postCompiler : pageCompiler;

  return compiler.getContentBySlug(slug);
}

export function getAllPosts(): PostData[] {
  return postCompiler.getPosts();
}

export function getPostChunks(): [] {
  const posts = getAllPosts();
  return chunk(posts, PER_PAGE);
}

export function getPageOfPosts(page: number): [] {
  const postChunks = getPostChunks();

  return postChunks[page - 1];
}

export function getTotalPostPages(): number {
  return getPostChunks().length;
}

export function getPostPageCount(): number {
  return getPostChunks().length;
}

export function getAllPages(): PostData[] {
  return pageCompiler.getPosts();
}

export function getImageDataForSlug(slug: string): { [key: string]: any } {
  return imageData[slug] || {};
}
