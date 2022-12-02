import Footer from "./footer";
import Nav from "./nav";
import Container from "./container";
import { ReactNode, forwardRef } from "react";
import Arrow from "./arrow";
import AnnouncementBar from "./annoucement-bar";

type LayoutProps = {
  children: ReactNode;
  narrow?: boolean;
};

const Layout = forwardRef(
  ({ children, narrow = false }: LayoutProps, ref: any) => {
    return (
      <>
        <Nav />

        <AnnouncementBar>
          JamComments, a guilt-free comment service for Jamstack blogs, is live!
          <a
            target="_blank"
            rel="noreferrer"
            href="https://jamcomments.com?utm_source=personal_site&utm_medium=website"
            className="inline-flex ml-1 md:ml-2 items-center font-semibold"
          >
            Check it out.{" "}
            <i className="ml-1 block h-4 w-4 text-white">
              <Arrow strokeWidth="3" />
            </i>
          </a>
        </AnnouncementBar>

        <main id="main" ref={ref}>
          <Container narrow={narrow} classes={"px-4"}>
            {children}
          </Container>
        </main>
        <Footer />
      </>
    );
  }
);

export default Layout;
