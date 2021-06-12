import Layout from "../../components/layout";
import Container from "../../components/container";
import Title from "../../components/title";
import Meta from "../../components/meta";
import { useRouter } from 'next/router';
import { useState } from "react";

const ThreadToBlogPost = () => {
  const router = useRouter();
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const twitterThing = [...e.target.elements].find(i => i.type === "text").value;

    setIsInvalid(!twitterThing);

    if(!twitterThing) {
      setIsLoading(false);
      return;
    }

    const match = twitterThing.match(/(?:.+\/status\/)?(.+)/);
    const id = match[1];

    await fetch('/api/thread-to-post', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        form_value: twitterThing,
        conversation_id: id
      })
    });

    router.push(`/thread-to-blog-post/${id}`);
  }

  return (
    <Layout>
      <Meta
        isPost={false}
        title={"Turn That Twitter Thread Into a Blog Post"}
        image={"https://macarthur.me/thread-to-post-og.jpg"}
        description={"A tool for those threads that probably just should've been blog post."}
      />
      <Container narrow={true}>
        <article className="mb-16">
          <Title
            isPost={false}
            subTitle={""}
          >
            Turn that tweet thread into a blog post.
          </Title>

          <p className="prose mb-10">
            A tool for when you come across a thread on Twitter that probably should've just been a blog post instead. Try it out for yourself. 🧵👇
          </p>

          {isInvalid && (
            <span
              className={
                "block text-base md:text-xl bg-red-200 text-red-700 px-3 py-2 rounded-md mb-10 text-center"
              }
            >
              Sorry, can't submit nothing.
            </span>
          )}

          <form onSubmit={handleSubmit}>
            <p className="mb-4">
              <label className="mb-1">
                Tweet URL or ID
              </label>

              <span className="block light-text mb-6">Example: https://twitter.com/jack/status/1071575088695140353 or 1071575088695140353</span>

              <input type="text"></input>
            </p>

            <p>
              <button type="submit" className="button">
                { isLoading ? "One sec..." : "Blog Post It" }
              </button>
            </p>
          </form>
        </article>
      </Container>
    </Layout>
  );
};

export default ThreadToBlogPost;
