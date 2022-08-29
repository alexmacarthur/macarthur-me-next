interface MarkdownLayoutProps<T> {
  pageData: T;
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

export interface ContentEntity {
  title: string;
  subtitle?: string;
  description: string;
  slug: string;
  markdown?: string;
  openGraphImage?: string;
}

export interface BlogPost extends ContentEntity {
  id: string;
  date: string;
  prettyDate: string;
  lastUpdated?: string;
  prettyLastUpdated?: string;
  externalUrl?: string;
  externalHost?: string;
  views?: string;
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
