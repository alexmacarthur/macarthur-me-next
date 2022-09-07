import Layout from "./layout";
import Title from "./title";
import Pagination from "./pagination";
import PostList from "./post-list";
import { PostListLayoutProps } from "../types/types";

const PostListLayout = ({
  posts,
  nextPage,
  previousPage,
  currentPage,
  totalPages,
}: PostListLayoutProps) => {
  return (
    <Layout narrow={true}>
      <Title showViews={false}>Posts</Title>

      <PostList posts={posts} />

      <Pagination
        currentPage={currentPage}
        previousPage={previousPage}
        nextPage={nextPage}
        totalPages={totalPages}
      />
    </Layout>
  );
};

export default PostListLayout;
