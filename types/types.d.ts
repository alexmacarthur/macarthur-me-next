interface MarkdownLayoutProps {
  pageData: BlogPost;
  isPost: boolean;
  comments?: any[];
  markdownCode: string;
  jamCommentsApiKey?: string;
  jamCommentsDomain?: string;
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

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string | null;
  date: string;
  prettyDate: string;
  description: string;
  lastUpdated: string | null;
  prettyLastUpdated?: string;
  externalUrl?: string;
  externalHost?: string;
  slug: string;
  excerpt: string;
  views: string;
  markdown?: string;
  openGraphImage?: string;
}

type PropertyTypes = `title` | `rich_text` | `date`;

interface NotionProperties {
  [k: string]: {
    property: any;
    type: PropertyTypes;
  };
}

interface PaginationProps {
  hasMore: boolean;
  hasPrevious: boolean;
  nextPage: number;
  previousPage: number;
  currentPage: number;
}
