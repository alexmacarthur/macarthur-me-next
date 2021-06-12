import Layout from "../../components/layout";
import Container from "../../components/container";
import Title from "../../components/title";
import Meta from "../../components/meta";
import getThread from '../../lib/twitter';

import ExternalIcon from "../../components/icon-external";
import Button from "../../components/button";

interface Thread {
  name: string,
  handle: string,
  date: string,
  tweets: any
}

const ThreadToBlogPost = ({ thread, tweetId }: { thread: Thread, tweetId: string }) => {
  if (!thread) {
    return (
      <Layout>
        <Container narrow={true}>
          <article className="mb-16">
            <Title
              isPost={false}
              subTitle={""}
            >
              Is that tweet even a thing?
            </Title>

            <h6 className="text-lg">
              <span className="inline-block mr-0 md:mr-4 mb-4 md:mb-0">Because it didn't work. Maybe try another one?</span>
              <Button href="/thread-to-blog-post" internal={true}>Try Again</Button>
            </h6>
          </article>
        </Container>
      </Layout>
    )
  }

  const { name, handle, date, tweets } = thread;

  const makeTweetLink = (id) => {
    return `https://twitter.com/${handle}/status/${id}`;
  }

  const title = `Here's a Twitter thread from ${name} as a blog post.`;

  return (
    <Layout>
      <Meta
        isPost={false}
        title={title}
        image={"https://macarthur.me/thread-to-post-og.jpg"}
        description={`A blog post version of a Twitter thread from ${name}.`}
      />
      <Container narrow={true}>
        <article className="mb-16">
          <Title
            date={new Date(date)}
            isPost={false}
            subTitle={""}
            secondaryMeta={() => {
              return <Button
                naked={true}
                small={true}
                internal={false}
                href={makeTweetLink(tweetId)}
                target="_blank"
              >
                See Original Thread
              </Button>
            }}
          >
            { title }
          </Title>

          {tweets.map((tweet, index) => {
            const { text, id } = tweet;
            const formattedTweet = text.replace(/(?:\r\n|\r|\n)/g, "<br/>");

            return (
              <div className="relative hoverable-block" key={index}>
                <div className="hoverable-block-container transition-all">
                  <a
                    className="md:opacity-0 absolute z-10 left-[.4rem] top-[.9rem]"
                    href={makeTweetLink(id)}
                    target="_blank">
                    <ExternalIcon classes="w-5 h-5 hover:text-purple-400" />
                  </a>

                  <div
                    className="post-content relative ml-auto md:mx-auto prose max-w-none md:prose-lg py-2 md:py-3"
                    dangerouslySetInnerHTML={{ __html: formattedTweet }}
                  ></div>
                </div>
              </div>
            );
          })}
        </article>

        <h6 className="text-center text-lg">
          <span className="inline-block mr-3 md:mr-4 mb-4 md:mb-0">Know of another thread that probs should've just been a blog post?</span>
          <Button href="/thread-to-blog-post" internal={true}>Do it here.</Button>
        </h6>
      </Container>
    </Layout>
  );
};

export default ThreadToBlogPost;

export async function getStaticProps({ params: { tweetId } }) {
  const thread = await getThread(tweetId);

  /**
   * To do:
   * - remove replies to other people replying to thread.
   */

  return {
    props: {
      tweetId,
      thread
    },
    revalidate: 604800
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}
