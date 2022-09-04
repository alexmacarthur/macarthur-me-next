import Link from "next/link";
import DateFormatter from "./date-formatter";
import Button from "./button";
import ViewCount from "./view-count";
import usePostViews from "../hooks/usePostViews";

const PostListCard = ({ post }) => {
  const postViews = usePostViews(post.slug);
  const { externalUrl, externalHost } = post;
  const linkProps = {
    href: externalUrl ? externalUrl : `/posts/${post.slug}`,
    target: externalUrl ? "_blank" : "_self",
  };

  return (
    <article>
      <h2 className="text-2xl font-bold">
        <Link {...linkProps}>
          <a {...linkProps}>{post.title}</a>
        </Link>
      </h2>

      <div className="flex items-center mb-3 gap-3 text-base">
        {post.lastUpdated && (
          <>
            <DateFormatter
              date={post.lastUpdated}
              prettyDate={post.prettyLastUpdated}
              className="inline-block"
            >
              Updated on
            </DateFormatter>

            <small>/</small>
          </>
        )}

        <DateFormatter
          date={post.date}
          prettyDate={post.prettyDate}
          className="inline-block"
        >
          {post.lastUpdated && "Originally posted on"}
        </DateFormatter>

        {!externalUrl && <ViewCount count={postViews} />}
      </div>

      <small className="block text-gray-500 mb-2">{post.description}</small>

      <Button naked={true} small={true} internal={!externalUrl} {...linkProps}>
        Read It {externalUrl && <>({externalHost})</>}
      </Button>
    </article>
  );
};

const PostList = ({ posts }) => {
  return (
    <ul className="space-y-10">
      {posts.map((post) => {
        return (
          <li key={post.slug}>
            <PostListCard post={post} />
          </li>
        );
      })}
    </ul>
  );
};

export default PostList;
