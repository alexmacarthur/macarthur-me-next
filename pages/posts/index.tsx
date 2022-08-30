import Meta from '../../components/meta';
import PostListLayout from '../../components/post-list-layout';
import CMSService from '../../lib/CMSService';
import { PostListLayoutProps } from '../../types/types';

const Posts = ({ posts, previousPage, nextPage, currentPage, totalPages }: PostListLayoutProps) => {
  return (
    <>
      <Meta />
      <PostListLayout
        posts={posts}
        currentPage={currentPage}
        previousPage={previousPage}
        nextPage={nextPage}
        totalPages={totalPages}
      />
    </>
  )
}

export default Posts;

export async function getStaticProps() {
  const cmsService = new CMSService();
  const { posts } = await cmsService.getPosts({
    pageNumber: 1, 
    propertiesToExclude: ["markdown"]
  });

  return {
    props: {
      posts,
      previousPage: null,
      nextPage: 2,
      currentPage: 1,
      totalPages: await cmsService.getTotalPages()
    },
    revalidate: 3600
  }
}
