import PostListLayout from '../../../components/post-list-layout';
import { getPageOfPosts, getPostPageCount, getTotalPostPages } from '../../../lib/api';

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

export async function getStaticProps({ params }) {
  const pageNumber = Number(params.pageNumber);
  const numberOfPages = getPostPageCount();
  const previousPage = pageNumber - 1;
  const nextPage = pageNumber + 1;

  return {
    props: {
      posts: await getPageOfPosts(pageNumber),
      previousPage: previousPage <= 0 ? null : previousPage,
      nextPage: nextPage > numberOfPages ? null : nextPage,
      currentPage: params.pageNumber,
      totalPages: getTotalPostPages()
    }
  }
}

export async function getStaticPaths() {
  const emptyArray = new Array(getPostPageCount());

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
