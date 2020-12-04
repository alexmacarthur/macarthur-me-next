import { getPageOfPosts, getTotalPostPages } from '../../lib/api';
import PostListLayout from '../../components/post-list-layout';

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
  return {
    props: {
      posts: getPageOfPosts(1),
      previousPage: null,
      nextPage: 2,
      currentPage: 1,
      totalPages: getTotalPostPages()
    }
  }
}
