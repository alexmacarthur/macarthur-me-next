import Footer from "./footer";
import Nav from "./nav";
import Container from "./container";
import { ReactNode, forwardRef } from "react";
import Arrow from "./arrow";

type LayoutProps = {
  children: ReactNode;
  narrow?: boolean;
};

const Layout = forwardRef(
  ({ children, narrow = false }: LayoutProps, ref: any) => {
    return (
      <>
        <Nav />

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
