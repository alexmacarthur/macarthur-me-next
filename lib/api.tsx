import PostCompiler from "./PostCompiler";

const pageSlugPattern = new RegExp(/(.+)(?:\.mdx?)/);

const pageCompiler = new PostCompiler("page", pageSlugPattern);

export async function getContentBySlug(slug: string) {
  return pageCompiler.getContentBySlug(slug);
}

export async function getAllPages(): Promise<PostData[]> {
  return pageCompiler.getPosts();
}
