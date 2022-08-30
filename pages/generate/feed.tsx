import generateRssFeed from "../../scripts/generateRssFeed";

const Feed = () => {
  return (
    <>You did it.</>
  );
};

export default Feed;

export async function getStaticProps() {
    await generateRssFeed();
    
    return {
        props: {}
    }
}
