import "prismjs/themes/prism-okaidia.css";
import MarkdownLayout from "../../components/markdown-layout";
import CMSService from "../../lib/CMSService";
import MarkdownService from "../../lib/MarkdownService";
import Meta from "../../components/meta";
import type { WithContext, BlogPosting } from "schema-dts";
import { MY_NAME, SITE_URL } from "../../lib/constants";
import useCurrentUrl from "../../hooks/useCurrentUrl";
import usePostViews from "../../hooks/usePostViews";

export default function Post({ post, commentData, markdownCode }) {
  const postViews = usePostViews(post.slug);

  let postSchema: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    datePublished: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": useCurrentUrl()
    },
    headline: post.title,
    isFamilyFriendly: true,
    description: post.description,
    image: post.openGraphImage,
    author: {
      "@type": "Person",
      name: MY_NAME,
      url: SITE_URL,
    },
  };

  if (post.subtitle) {
    postSchema.alternativeHeadline = post.subtitle;
  }

  if (post.lastUpdated) {
    postSchema.dateModified = post.lastUpdated;
  }

  return (
    <>
      <Meta 
        schema={postSchema}
        title={post.title}
        subtitle={post.subtitle}
        image={post.openGraphImage}
        description={post.description}
      />

      <MarkdownLayout
        pageData={post}
        commentData={commentData}
        markdownCode={markdownCode}
        isPost={true}
        views={postViews}
      />
    </>
  )
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const post = await (new CMSService()).getPost(slug);
  const { code } = await (new MarkdownService()).processMarkdown(post.markdown);
  const { fetchMarkup } = require("@jam-comments/next");

  const commentData = await fetchMarkup({
    domain: process.env.JAM_COMMENTS_DOMAIN,
    apiKey: process.env.JAM_COMMENTS_API_KEY,
    path: `/posts/${params.slug}`
  });

  return {
    props: {
      jamCommentsApiKey: process.env.JAM_COMMENTS_API_KEY,
      jamCommentsDomain: process.env.JAM_COMMENTS_DOMAIN,
      commentData,
      markdownCode: code, 
      post
    }, 
  }
}

export async function getStaticPaths() {
  // @todo Don't need to fetch all properties here. 
  const posts = await (new CMSService()).getAllPosts(false);

  return {
    paths: posts.map(({ slug }) => {
      return {
        params: { slug },
      };
    }), 
    fallback: false
  }
}
