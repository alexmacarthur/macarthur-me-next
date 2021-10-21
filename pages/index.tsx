import Meta from "../components/meta";
import Nav from "../components/nav";
import Logo from "../components/logo";
import SocialLinks from "../components/social-links";
import Link from 'next/link';

export default function Index() {
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
          <div className="mt-6 md:mt-8 lg:mt-10 mb-16">
            <SocialLinks />
          </div>
        </div>
      </main>
    </>
  );
}
