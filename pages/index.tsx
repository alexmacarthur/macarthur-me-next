import Meta from "../components/meta";
import Nav from "../components/nav";
import Logo from "../components/logo";
import SocialLinks from "../components/social-links";
import Link from "next/link";
import ViewCount from "../components/view-count";
import DateFormatter from "../components/date-formatter";
import Button from "../components/button";
import CMSService from "../lib/CMSService";
import { BlogPost } from "../types/types";

interface IndexProps {
  featuredPosts: BlogPost[];
}

export default function Index({ featuredPosts }: IndexProps) {
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
              A web developer bossing around computers in made-up languages.
            </span>
            <div className="mt-4 mb-20">
              <SocialLinks />
            </div>
          </div>

          <div className="max-w-5xl mb-10">
            <h2 className="text-2xl font-bold mb-6">Featured Blog Posts</h2>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => {
                const {
                  title,
                  views,
                  date,
                  slug,
                  prettyDate,
                  externalUrl,
                  externalHost,
                } = post;
                const postPath = `/posts/${slug}`;
                const postUrl = externalUrl ? externalUrl : postPath;
                const target = externalUrl ? "_blank" : "_self";

                return (
                  <li
                    className="border-4 rounded-md border-gray-800 hover:border-purple-500 flex flex-col h-full p-4 md:p-8"
                    key={slug}
                  >
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-2">
                        <Link href={postUrl}>
                          <a target={target}>{title}</a>
                        </Link>
                      </h3>
                      <DateFormatter date={date} prettyDate={prettyDate} />
                    </div>

                    <div className="mt-auto flex justify-between items-center">
                      <Button
                        naked={true}
                        small={true}
                        href={postUrl}
                        internal={!externalUrl}
                        target={target}
                      >
                        Read It {externalHost ? `on ${externalHost}` : ""}
                      </Button>

                      <ViewCount count={views} disableAnimation={true} />
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
  const cmsService = new CMSService();

  const featuredPostPromises = [
    "when-dom-updates-appear-to-be-asynchronous",
    "use-web-workers-for-your-event-listeners",
    "send-an-http-request-on-page-exit",
  ].map((slug) =>
    cmsService.getPost(slug, ["markdown", "description", "openGraphImage"])
  );

  return {
    props: {
      featuredPosts: await Promise.all(featuredPostPromises),
    },
  };
}
