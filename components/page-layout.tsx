import Layout from './layout'
import Container from './container'
import Title from './title';
import Head from 'next/head';

export default function PageLayout ({children, title, subtitle = "", open_graph = null }) {
  return (
    <Layout>
      <Container narrow={true}>
        <Head>
          <title>{title} | Alex MacArthur</title>
          {open_graph && <meta property="og:image" content={open_graph} />}
        </Head>

        <Title subtitle={subtitle}>
          { title }
        </Title>

        {children}
      </Container>
    </Layout>
  )
}
