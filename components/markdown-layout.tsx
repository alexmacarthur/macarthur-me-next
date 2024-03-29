import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "./container";
import Layout from "./layout";
import Title from "./title";
import Bio from "./bio";
import { activateImage, createObserver } from "../lib/images";
import { useRef, useEffect } from "react";
import { fullUrlFromPath } from "../lib/utils";
import { JamComments } from "@jam-comments/next";

import "prismjs/themes/prism-okaidia.css";
import Feedback from "./feedback";
import { BlogPost, MarkdownLayoutProps } from "../types/types";

export default function MarkdownLayout({
  pageData,
  markdownCode,
  isPost = false,
  views,
  commentData = null,
}: MarkdownLayoutProps<BlogPost>) {
  const contentRef = useRef(null);
  const router = useRouter();
  const { title, subtitle, date, prettyDate, lastUpdated, prettyLastUpdated } =
    pageData;

  useEffect(() => {
    if (!contentRef.current) return;

    const images = Array.from(
      contentRef.current.querySelectorAll("[data-lazy-src]")
    );

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

  if (!router.isFallback && !pageData?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const ContainerContent: any = () => (
    <>
      <Title
        date={date}
        prettyDate={prettyDate}
        isPost={isPost}
        subtitle={subtitle}
        lastUpdated={lastUpdated}
        prettyLastUpdated={prettyLastUpdated}
        views={isPost ? views : ""}
      >
        {title}
      </Title>

      <div
        className="
        post-content 
        mx-auto 
        prose 
        prose-headings:text-gray-700 
        prose-headings:font-extrabold
        prose-headings:mb-5
        prose-headings:leading-tight
        prose-headings:text-2xl
        max-w-none 
        md:prose-lg"
        dangerouslySetInnerHTML={{ __html: markdownCode }}
      />
    </>
  );

  return (
    <Layout ref={contentRef}>
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

              {commentData && (
                <div className="mt-16">
                  <JamComments markup={commentData} />
                </div>
              )}
            </div>
          </>
        )}
      </Container>
    </Layout>
  );
}
