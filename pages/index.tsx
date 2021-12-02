import Meta from "../components/meta";
import Nav from "../components/nav";
import Logo from "../components/logo";
import SocialLinks from "../components/social-links";
import Link from "next/link";
import { getAllPosts, getTopPosts } from "../lib/api";
import ViewCount from "../components/view-count";
import DateFormatter from "../components/date-formatter";
import Button from "../components/button";

export default function Index({ featuredPosts }) {
  return (
    <>
      <Meta />
      <Nav />

      <main className="w-screen flex justify-center p-4 md:p-6">
        <div className="text-white">
          <div className="max-w-5xl mb-4 flex flex-col justify-center pt-12 lg:pt-20 pb-8 lg:pb-10">
            <h1 className="font-semibold text-4xl md:text-6xl lg:text-8xl">
              <Logo>I'm Alex MacArthur.</Logo>
            </h1>
            <span className="text-base">
              A web developer who's prone to solving problems with JavaScript,
              PHP, and Ruby.
            </span>
            <div className="mt-4 mb-20">
              <SocialLinks />
            </div>
          </div>

          <div className="max-w-5xl mb-10">
            <h2 className="text-2xl font-bold mb-6">Featured Blog Posts</h2>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => {
                const { title, views, date, slug } = post;
                const postPath = `/posts/${slug}`;

                return (
                  <li
                    className="border-4 rounded-md border-gray-800 hover:border-purple-500 flex flex-col h-full p-4 md:p-8"
                    key={slug}
                  >
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-2">
                        <Link href={postPath}>
                          <a>{title}</a>
                        </Link>
                      </h3>
                      <DateFormatter date={date} />
                    </div>

                    <div className="mt-auto flex justify-between items-center">
                      <Button
                        naked={true}
                        small={true}
                        href={postPath}
                        internal={true}
                      >
                        Read It
                      </Button>

                      <ViewCount count={views} />
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex justify-end mt-4">
              <Button
                naked={true}
                small={true}
                href="/posts"
                internal={true}
                inheritColor={true}
              >
                View All
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();

  const featuredPosts = [
    "when-dom-updates-appear-to-be-asynchronous",
    "use-web-workers-for-your-event-listeners",
    "when-a-weakmap-came-in-handy",
  ].map((slug) => {
    return posts.find((post) => post.slug === slug);
  });

  return {
    props: {
      topPosts: await getTopPosts(),
      featuredPosts,
    },
    revalidate: 86400, // once per day
  };
}
