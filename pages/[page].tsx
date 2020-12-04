import MarkdownLayout from "../components/markdown-layout";
import { getContentBySlug, getAllPages } from "../lib/api";

export default function Page({ page }) {
  return <MarkdownLayout pageData={page} isPost={false} />;
}

export async function getStaticProps({ params }) {
  const page = getContentBySlug(params.page, 'page');
  const content = page.content || "";

  return {
    props: {
      page: {
        ...page,
        content,
      }
    },
  };
}

export async function getStaticPaths() {
  const pages = getAllPages();

  return {
    paths: pages.map((page) => {
      return {
        params: {
          page: page.slug,
        },
      };
    }),
    fallback: false,
  };
}
