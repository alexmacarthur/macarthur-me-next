import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "./container";
import Layout from "./layout";
import Title from "./title";
import Meta from "./meta";
import Bio from "./bio";
import SocialShare from "./social-share";
import { activateImage, createObserver } from "../lib/images";
import { useRef, useEffect } from "react";
import { fullUrlFromPath } from "../lib/utils";
import { JamComments } from "@jam-comments/next";

import "prismjs/themes/prism-okaidia.css";

export default function PostLayout({
  pageData,
  isPost = false,
  comments = [],
  jamCommentsApiKey = "",
  jamCommentsDomain = "",
}: MarkdownLayoutProps) {
  const contentRef = useRef(null);
  const router = useRouter();
  const { title, subTitle, date, ogImage, excerpt } = pageData;

  if (!router.isFallback && !pageData?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  useEffect(() => {
    if (!contentRef.current) return;

    const images = [...contentRef.current.querySelectorAll("[data-lazy-src]")];

    const observers = images.map((image) => {
      const observer = createObserver(image, () => {
        activateImage(image, (e) => {
          e.target.classList.add("opacity-100");
        });
      });

      observer.observe();

      return observer;
    });

    return () => {
      observers.forEach(({ kill }) => kill());
    };
  }, []);

  const ContainerContent: any = () => (
    <>
      <Title date={date} isPost={isPost} subTitle={subTitle}>
        {title}
      </Title>

      <div
        className="post-content mx-auto prose max-w-none md:prose-lg"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      ></div>
    </>
  );

  return (
    <Layout ref={contentRef}>
      <Meta isPost={true} title={title} subTitle={subTitle} image={ogImage} description={excerpt} />
      <Container narrow={true}>
        {!isPost && <ContainerContent />}

        {isPost && (
          <>
            <article className="mb-16">
              <ContainerContent />
            </article>

            <div className="max-w-xl mx-auto">
              <Bio />
              <SocialShare title={title} url={fullUrlFromPath(router.asPath)} />

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
