import Meta from "../components/meta";
import Nav from "../components/nav";
import Logo from "../components/logo";
import SocialLinks from "../components/social-links";

export default function Index() {
  return (
    <>
      <Meta />

      <Nav isAbsolute={true} />

      <div className="min-h-screen">
        <main className="h-screen w-screen flex items-center justify-center p-4 md:p-6">
          <div className="text-white">
            <div className="max-w-5xl mb-4">
              <h1 className="font-semibold leading-none text-4xl md:text-7xl text-gray-900">
                <Logo>
                  I'm Alex MacArthur, a web developer in <span className="font-black whitespace-nowrap">Nashville-ish, TN.</span>
                </Logo>
              </h1>
            </div>
            <SocialLinks />
          </div>
        </main>
      </div>

      {/* <Container>
        <div>
          <h2>What I've Been Writing</h2>

          <div className="border-2 border-gray-200 rounded-lg p-10 project-card flex flex-col">
            <h3>My post title</h3>

          </div>
        </div>

        <div>
          <h2>Projects Keeping Me Busy</h2>

          <div className="border-2 border-gray-200 rounded-lg p-10 project-card flex flex-col">
            <h3>My post title</h3>

          </div>
        </div>
      </Container> */}
    </>
  );
}
