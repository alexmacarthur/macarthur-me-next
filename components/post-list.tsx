import Link from 'next/link';
import DateFormatter from './date-formatter';
import Button from './button';

const PostList = ({posts}) => {
  return (
    <ul className="space-y-10">
      {posts.map(post => {
        return (
          <li key={post.slug}>
            <article>
              <h2 className="text-2xl font-bold">
                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              <DateFormatter dateString={post.date} className="inline-block mb-3" />

              <small className="block text-gray-500 mb-2">
                {post.excerpt}
              </small>

              <Button naked={true} small={true} href={`/posts/${post.slug}`} internal={true}>
                Read It
              </Button>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

export default PostList;
