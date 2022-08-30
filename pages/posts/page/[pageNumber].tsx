import Meta from '../../../components/meta';
import PostListLayout from '../../../components/post-list-layout';
import CMSService from '../../../lib/CMSService';
import { PostListLayoutProps } from '../../../types/types';

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

export async function getStaticProps({ params }) {
  const cmsService = new CMSService();
  const pageNumber = Number(params.pageNumber);
  const numberOfPages = await cmsService.getTotalPages()
  const previousPage = pageNumber - 1;
  const nextPage = pageNumber + 1;

  return {
    props: {
      posts: await cmsService.getPosts({
        pageNumber, 
        propertiesToExclude: ["markdown"]
      }),
      previousPage: previousPage <= 0 ? null : previousPage,
      nextPage: nextPage > numberOfPages ? null : nextPage,
      currentPage: params.pageNumber,
      totalPages: numberOfPages
    },
    revalidate: 3600,
  }
}

export async function getStaticPaths() {
  const cmsService = new CMSService();
  const count = await cmsService.getTotalPages()
  const emptyArray = new Array(count);

  return {
    paths: (emptyArray.fill(null)).map((_value, index) => {
      return {
        params: {
          pageNumber: (index + 1).toString()
        }
      }
    }),
    fallback: false
  };
}
