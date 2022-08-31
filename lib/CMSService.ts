import NotionService from "./NotionService";
import chunk from "lodash.chunk";
import { POSTS_PER_PAGE } from "./constants";
import AnalyticsService from "./AnalyticsService";
import { BlogPost, ContentEntity } from "../types/types";

interface PostCache {
  allPosts?: BlogPost[];
}

const postCache: PostCache = {
  allPosts: undefined,
};

class CMS {
  provider: NotionService;
  analyticsService;

  constructor() {
    this.provider = new NotionService();
    this.analyticsService = new AnalyticsService();
  }

  async getTotalPages(): Promise<number> {
    const allPosts = await this.getAllPosts();
    const postChunks = chunk(allPosts, POSTS_PER_PAGE);

    return postChunks.length;
  }

  async getAllPosts(hydrate: boolean = true): Promise<BlogPost[]> {
    if (postCache.allPosts) {
      // @todo Figure out if this actually works in a deployed context.
      console.log("Retrieving all posts from cache.");
      return postCache.allPosts;
    }

    let posts = [];
    let startCursor = undefined;
    let hasMore = true;

    while (hasMore) {
      let response = await this.provider.getPublishedBlogPosts({
        startCursor,
        perPageOverride: 100,
        hydrate,
      });

      console.log(`Fetched ${response.posts.length} posts...`);

      posts = posts.concat(response.posts);
      hasMore = response.hasMore;
      startCursor = response.nextCursor;
    }

    postCache.allPosts = posts;

    return posts;
  }

  async getPosts({
    pageNumber,
    propertiesToExclude = [],
  }: {
    pageNumber: number;
    propertiesToExclude?: (keyof ContentEntity)[];
  }): Promise<{
    posts: ContentEntity[];
    hasMore: boolean;
    hasPrevious: boolean;
  }> {
    let allPosts: ContentEntity[] = [];
    let nextCursor;
    let hasMore = false;

    for (let i = 0; i < pageNumber; i++) {
      let {
        posts,
        nextCursor: next_cursor,
        hasMore: has_more,
      } = await this.provider.getPublishedBlogPosts({
        startCursor: nextCursor,
      });

      allPosts = allPosts.concat(posts as BlogPost[]);
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
      posts: posts.map((p) => {
        propertiesToExclude.forEach((property) => {
          delete p[property];
        });

        return p;
      }),
      hasMore,
      hasPrevious: pageNumber > 1,
    };
  }

  async getPost(slug: string) {
    return this.provider.getSingleBlogPost(slug);
  }
}

export default CMS;
