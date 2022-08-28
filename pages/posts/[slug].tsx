import MarkdownLayout from "../../components/markdown-layout";
import "prismjs/themes/prism-okaidia.css";
import CMSService from "../../lib/CMSService";
import MarkdownService from "../../lib/MarkdownService";

export default function Post({ post, comments, markdownCode, jamCommentsDomain, jamCommentsApiKey }) {
  return <MarkdownLayout
    pageData={post}
    comments={comments}
    markdownCode={markdownCode}
    jamCommentsApiKey={jamCommentsApiKey}
    jamCommentsDomain={jamCommentsDomain}
    isPost={true}
  />;
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const post = await (new CMSService()).getPost(slug);
  const { code } = await (new MarkdownService()).processMarkdown(post.markdown);

  const { fetchByPath } = require("@jam-comments/next");

  const comments = await fetchByPath({
    domain: process.env.JAM_COMMENTS_DOMAIN,
    apiKey: process.env.JAM_COMMENTS_API_KEY,
    path: `/posts/${slug}`
  });

  return {
    props: {
      jamCommentsApiKey: process.env.JAM_COMMENTS_API_KEY,
      jamCommentsDomain: process.env.JAM_COMMENTS_DOMAIN,
      comments,
      markdownCode: code, 
      post
    }, 
  }
}

export async function getStaticPaths() {
  const posts = await (new CMSService()).getAllPosts();

  return {
    paths: posts.map(({ slug }) => {
      return {
        params: { slug },
      };
    }),
    fallback: false
  }
}
