import Container from "../../components/container";
import generateSitemap from "../../scripts/generateSitemap";

const Feed = ({ pageCount, postCount }) => {
  return (
    <Container classes="text-center">
      <h1>Sitemap generated!</h1>

      <p>Pages: {pageCount}, Posts: {postCount}</p>
    </Container>
  );
};

export default Feed;

export async function getStaticProps() {
    return {
      props: await generateSitemap()
    }
}
