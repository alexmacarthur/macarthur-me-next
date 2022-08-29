import { useRouter } from "next/router";
import { getMDXComponent } from "mdx-bundler/client";
import ErrorPage from "next/error";
import Container from "./container";
import Layout from "./layout";
import Title from "./title";
import Meta from "./meta";
import Bio from "./bio";
import { activateImage, createObserver } from "../lib/images";
import { useRef, useEffect, useMemo } from "react";
import { fullUrlFromPath } from "../lib/utils";
import { JamComments } from "@jam-comments/next";

import "prismjs/themes/prism-okaidia.css";
import Feedback from "./feedback";
import { BlogPost, MarkdownLayoutProps } from "../types/types";

export default function MarkdownLayout({
  pageData,
  markdownCode,
  isPost = false,
  comments = [],
  jamCommentsApiKey = "",
  jamCommentsDomain = "",
}: MarkdownLayoutProps<BlogPost>) {
  const contentRef = useRef(null);
  const router = useRouter();
  const { 
    title,
    subtitle,
    date,
    prettyDate,
    openGraphImage, 
    description, 
    lastUpdated,
    prettyLastUpdated,
    views } = pageData;
  const MarkupComponent = useMemo(() => getMDXComponent(markdownCode), [markdownCode]);

  if (!router.isFallback && !pageData?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  useEffect(() => {
    if (!contentRef.current) return;

    const images = Array.from(contentRef.current.querySelectorAll("[data-lazy-src]"));

    const observers = images.map((image) => {
      const observer = createObserver(image, () => {
        activateImage(image, (e) => {
          e.target.style.opacity = "1";
        });
      });

      observer.observe();

      return observer;
    });

    return () => {
      observers.forEach(({ kill }) => kill());
    };
  });

  const ContainerContent: any = () => (
    <>
      <Title
        date={date}
        prettyDate={prettyDate}
        isPost={isPost}
        subTitle={subtitle}
        lastUpdated={lastUpdated}
        prettyLastUpdated={prettyLastUpdated}
        views={isPost ? views : ""}
      >
        {title}
      </Title>

      <div
        className="post-content mx-auto prose max-w-none md:prose-lg"
      >
        <MarkupComponent />
      </div>
    </>
  );

  return (
    <Layout ref={contentRef}>
      <Meta
        isPost={isPost}
        title={title}
        date={date}
        lastUpdated={lastUpdated}
        subtitle={subtitle}
        image={openGraphImage}
        description={description}
      />
      <Container narrow={true}>
        {!isPost && <ContainerContent />}

        {isPost && (
          <>
            <article className="mb-16">
              <ContainerContent />
            </article>

            <div className="max-w-xl mx-auto">
              <Feedback url={fullUrlFromPath(router.asPath)} />

              <Bio />

              <div className="mt-16">
                <JamComments
                  comments={comments}
                  domain={jamCommentsDomain}
                  apiKey={jamCommentsApiKey}
                />
              </div>
            </div>
          </>
        )}
      </Container>
    </Layout>
  );
}
