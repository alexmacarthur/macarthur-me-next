import MarkdownLayout from "../components/markdown-layout";
import Meta from "../components/meta";
import MarkdownService from "../lib/MarkdownService";

export default function Page({ page, markdownCode }) {
  return <>
    <Meta
      schemas={}
      title={page.title}
      lastUpdated={lastUpdated}
      subtitle={subtitle}
      image={openGraphImage}
      description={description}
    />
    
    <MarkdownLayout 
      pageData={page} 
      markdownCode={markdownCode}
      isPost={false} 
    />
  </>;
}

export async function getStaticProps({ params }) {
  const markdownService = new MarkdownService();
  const page = markdownService.getPage(params.page);
  const { code: markdownCode} = await markdownService.processMarkdown(page.markdown);

  return {
    props: {
      markdownCode,
      page
    },
  };
}

export async function getStaticPaths() {
  const markdownService = new MarkdownService();

  return {
    paths: markdownService.getAllPageSlugs().map(page => {
      return {
        params: { page }
      }
    }),
    fallback: false,
  };
}
