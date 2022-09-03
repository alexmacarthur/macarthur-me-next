import MarkdownLayout from "../../components/markdown-layout";
import "prismjs/themes/prism-okaidia.css";
import CMSService from "../../lib/CMSService";
import MarkdownService from "../../lib/MarkdownService";
import Meta from "../../components/meta";
import type { WithContext, BlogPosting } from "schema-dts";
import { MY_NAME, SITE_URL } from "../../lib/constants";
import useCurrentUrl from "../../hooks/useCurrentUrl";
import { useEffect } from "react";

export default function Post({ post, comments, markdownCode, jamCommentsDomain, jamCommentsApiKey, scriptsToLoad }) {
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

  useEffect(() => {
    scriptsToLoad.forEach((s: string) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = s;

      document.body.insertBefore(script, null);
    });
  }, []);

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
        comments={comments}
        markdownCode={markdownCode}
        jamCommentsApiKey={jamCommentsApiKey}
        jamCommentsDomain={jamCommentsDomain}
        isPost={true}
      />
    </>
  )
  
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const post = await (new CMSService()).getPost(slug);
  const { code } = await (new MarkdownService()).processMarkdown(post.markdown);
  const { fetchByPath } = require("@jam-comments/next");

  const vendorScripts = [
    {
      src: "https://cpwebassets.codepen.io/assets/embed/ei.js",
      pattern: new RegExp("codepen.io/(.+)/pen/(.+)"),
    },
  ];

  const scriptsToLoad = vendorScripts
    .filter(({ pattern }) => pattern.test(post.markdown))
    .map((s) => s.src);

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
      post, 
      scriptsToLoad
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
