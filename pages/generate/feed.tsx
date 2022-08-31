import Container from "../../components/container";
import generateRssFeed from "../../scripts/generateRssFeed";

const Feed = ({ postCount }) => {
  return (
    <Container classes="text-center">
      <h1>RSS feed generated!</h1>

      <p>{postCount} posts</p>
    </Container>
  );
};

export default Feed;

export async function getStaticProps() {
    return {
        props: await generateRssFeed()
    }
}
