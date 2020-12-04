import Footer from './footer'
import Meta from './meta'
import Nav from './nav';
import Container from './container';
import { ReactNode, forwardRef } from 'react';

type LayoutProps = {
  children: ReactNode,
  narrow?: boolean
}

const Layout = forwardRef(({ children, narrow = false }: LayoutProps, ref: any) => {
  return (
    <>
      <Meta />
      <Nav />
      <main id="main" ref={ref}>
        <Container narrow={narrow} classes={"px-4"}>
          {children}
        </Container>
      </main>
      <Footer />
    </>
  )
});

export default Layout;
