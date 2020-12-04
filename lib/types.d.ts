type ContentType = 'page' | 'post';
interface PostData {
  slug: string;
  path: string;
  date: string;
  title: string;
  content: string;
  excerpt?: string;
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
