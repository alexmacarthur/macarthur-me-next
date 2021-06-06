type ContentType = "page" | "post";
interface PostData {
  slug: string;
  path: string;
  date: string;
  title: string;
  subTitle?: string;
  ogImage?: string;
  content: string;
  excerpt?: string;
  external?: string;
  lastUpdated?: string;
}

interface MarkdownLayoutProps {
  pageData: PostData;
  isPost: boolean;
  comments?: any[];
  jamCommentsApiKey?: string;
  jamCommentsDomain?: string;
}
interface ContentData {
  slugPattern: RegExp;
  directory: string;
}

interface PostListLayoutProps {
  posts: PostData[];
  nextPage: number;
  previousPage: number;
  currentPage: number;
  totalPages: number;
}

declare namespace JSX {
  interface IntrinsicElements {
    "feedback-component": any;
  }
}
