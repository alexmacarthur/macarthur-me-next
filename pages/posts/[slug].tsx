import MarkdownLayout from "../../components/markdown-layout";
import { getContentBySlug, getAllPosts } from "../../lib/api";

import "prismjs/themes/prism-okaidia.css";

export default function Post({ post, comments, jamCommentsDomain, jamCommentsApiKey }) {
  return <MarkdownLayout
    pageData={post}
    comments={comments}
    jamCommentsApiKey={jamCommentsApiKey}
    jamCommentsDomain={jamCommentsDomain}
    isPost={true}
  />;
}

export async function getStaticProps({ params }) {
  const post = await getContentBySlug(params.slug, 'post');
  const { fetchByPath } = require("@jam-comments/next");

  const comments = await fetchByPath({
    domain: process.env.JAM_COMMENTS_DOMAIN,
    apiKey: process.env.JAM_COMMENTS_API_KEY,
    path: `/posts/${params.slug}`
  });

  return {
    props: {
      jamCommentsApiKey: process.env.JAM_COMMENTS_API_KEY,
      jamCommentsDomain: process.env.JAM_COMMENTS_DOMAIN,
      comments,
      post
    },
    revalidate: 3600
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
