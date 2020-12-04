import Meta from '../components/meta'
import Nav from '../components/nav';
import Logo from '../components/logo';
import SocialLinks from '../components/social-links';

export default function Index() {
  return (
    <>
      <Meta />

      <Nav isAbsolute={true} />

      <div className="min-h-screen">
        <main className="h-screen w-screen flex items-center justify-center p-6">
          <div className="text-white">
            <h1 className="font-semibold leading-none text-5xl md:text-7xl text-gray-900 mb-2">
              <Logo />
            </h1>
            <span className="md:pl-0 text-xl md:text-2xl leading-tight md:leading-10 inline-block text-gray-500 font-light mb-4">is a web developer in Nashville-ish, TN.</span>
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
  )
}
