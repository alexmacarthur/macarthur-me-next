import Layout from "./layout";
import Container from "./container";
import Title from "./title";
import Head from "next/head";

export default function PageLayout({ children, title, subtitle = "" }) {
  return (
    <Layout>
      <Container narrow={true}>
        <Head>
          <title>{title} | Alex MacArthur</title>
        </Head>

        <Title subtitle={subtitle}>{title}</Title>

        {children}
      </Container>
    </Layout>
  );
}
