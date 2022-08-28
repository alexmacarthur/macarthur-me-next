import PostListLayout from '../../components/post-list-layout';
import CMSService from '../../lib/CMSService';
import { POSTS_PER_PAGE } from '../../lib/constants';
import { PostListLayoutProps } from '../../types/types';
import chunk from "lodash.chunk";

const Posts = ({ posts, previousPage, nextPage, currentPage, totalPages }: PostListLayoutProps) => {
  return (
    <PostListLayout
      posts={posts}
      currentPage={currentPage}
      previousPage={previousPage}
      nextPage={nextPage}
      totalPages={totalPages}
    />
  )
}

export default Posts;

export async function getStaticProps() {
  const cmsService = new CMSService();
  const allPosts = await cmsService.getAllPosts();
  const postChunks = chunk(allPosts, POSTS_PER_PAGE);
  const { posts } = await cmsService.getPosts(1);

  return {
    props: {
      posts,
      previousPage: null,
      nextPage: 2,
      currentPage: 1,
      totalPages: postChunks.length
    },
    revalidate: 3600
  }
}
