import Meta from "../components/meta";
import Nav from "../components/nav";
import Logo from "../components/logo";
import SocialLinks from "../components/social-links";
import Link from 'next/link';
import { getTopPosts } from "../lib/api";
import ViewCount from "../components/view-count";
import DateFormatter from "../components/date-formatter";
import Button from "../components/button";

export default function Index({ topPosts }) {
  return (
    <>
      <Meta />

      <Nav />

      <main className="w-screen flex justify-center p-4 md:p-6">
        <div className="text-white">
          <div className="max-w-5xl mb-4">
            <h1 className="font-semibold text-3xl md:text-4xl lg:text-6xl">
              <Logo>
                I'm Alex MacArthur, a web developer who's prone to solving problems with JavaScript, PHP, and Ruby.

                <br />
                <br />

                Since 2015, I've worked for <a className="hoverable-block" target="_blank" href="https://ramseysolutions.com">Dave Ramsey</a> in <span className="font-black whitespace-nowrap">Nashville-ish, TN</span>, grateful to do something I love for a mission that matters.
                
                <br />
                <br />

                To get in touch, fill out <Link href="/contact">this form</Link>, or find me on the following platforms:
              </Logo>
            </h1>
          </div>
          <div className="mt-6 md:mt-8 lg:mt-10 mb-20">
            <SocialLinks />
          </div>

          <div className="max-w-5xl mb-16">

            <div className="mb-20">
              <h2 className="text-2xl font-bold mb-6">Most-Viewed Blog Posts</h2>

              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topPosts.map(post => {
                  const { title, views, date, slug } = post;
                  const postPath = `/posts/${slug}`;

                  return (
                    <li className="border-4 rounded-md border-gray-800 hover:border-purple-500">
                      <Link href={postPath}>
                        <a className="flex flex-col h-full p-4 md:p-8">
                          <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
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
                        </a>
                      </Link>
                    </li>
                  )
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
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      topPosts: await getTopPosts()
    }, 
    revalidate: 86400 // once per day
  }
}
