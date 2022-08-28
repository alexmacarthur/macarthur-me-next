import NotionService from "./NotionService";
import chunk from "lodash.chunk";
import { POSTS_PER_PAGE } from "./constants";
import AnalyticsService from "./AnalyticsService";
import { BlogPost } from "../types/types";

class CMS {
  provider: NotionService;
  analyticsService;

  constructor() {
    this.provider = new NotionService();
    this.analyticsService = new AnalyticsService();
  }

  async getAllPosts(): Promise<BlogPost[]> {
    let posts = [];
    let nextCursor = undefined;
    let hasMore = true;

    while(hasMore) {
        let response = await this.provider.getPublishedBlogPosts(nextCursor, 100);

        console.log(`Fetched ${response.posts.length} posts...`);

        posts = posts.concat(response.posts);
        hasMore = response.hasMore;
        nextCursor = response.nextCursor;
    }

    return posts;
  }

  async getPosts(pageNumber: number = 2): Promise<{
    posts: BlogPost[];
    hasMore: boolean;
    hasPrevious: boolean;
  }> {
    let allPosts: BlogPost[] = [];
    let nextCursor;
    let hasMore = false;

    for (let i = 0; i < pageNumber; i++) {
      let {
        posts,
        nextCursor: next_cursor,
        hasMore: has_more,
      } = await this.provider.getPublishedBlogPosts(nextCursor);

      allPosts = allPosts.concat(posts);
      nextCursor = next_cursor;
      hasMore = has_more;

      // Don't bother trying to query the next page if there's nothing there.
      if (!hasMore) {
        break;
      }
    }

    let chunks = chunk(allPosts, POSTS_PER_PAGE);
    let chunkIndex = pageNumber - 1;
    let posts = chunks[chunkIndex] ?? chunks.flat();

    return {
      posts,
      hasMore,
      hasPrevious: pageNumber > 1,
    };
  }

  async getPost(slug: string) {
    return this.provider.getSingleBlogPost(slug);
  }
}

export default CMS;
