import PageLayout from "../components/page-layout";
import GoogleAnalyticsService from "../lib/GoogleAnalyticsService";
import GitHubService from "../lib/GitHubService";
import SupabaseService from "../lib/SupabaseService";
import GoogleSearchService from "../lib/GoogleSearchService";

const Dashboard = ({ stats }) => {
  return (
    <PageLayout title="Dashboard" subTitle="Some vanity metrics I like to keep an eye on.">

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map(stat => {
          return (
            <li key={stat.title}>
              <h2 dangerouslySetInnerHTML={{__html: stat.title}}></h2>
              <span className="text-4xl md:text-5xl font-black">{stat.value}</span>
            </li>
          )
        })}
      </ul>
    </PageLayout>
  );
};

export default Dashboard;

export async function getStaticProps() {
  type State = {
    title: string,
    value: number | string | Promise<number | string>
  };

  const gaService = new GoogleAnalyticsService();
  const ghService = new GitHubService();
  const supService = new SupabaseService();
  const gsService = new GoogleSearchService();

  const stats: State[] = [
    {
      title: 'Total GitHub Stars',
      value: ghService.getTotalsStars()
    },
    {
      title: 'Total Page Views',
      value: gaService.getPageViewCount()
    },
    {
      title: 'Positive Feedback (👍) on Blog Posts',
      value: supService.getPositiveFeedbackCount()
    },
    {
      title: 'Links in <em>JavaScript Weekly</em>',
      value: gsService.getJsWeeklyTotalResults()
    },
    {
      title: 'Inches Grown',
      value: Promise.resolve(68)
    },
    {
      title: 'Articles Published in <em>CSS Tricks</em>',
      value: Promise.resolve(2)
    },
    {
      title: 'Miles Run in the Last Year',
      value: Promise.resolve('coming soon')
    },
    {
      title: 'npm Downloads',
      value: Promise.resolve('coming soon')
    }
  ];

  await Promise.allSettled(stats.map(stat => stat.value));

  for(let stat of stats) {
    stat.value = (await stat.value).toLocaleString();
  }

  return {
    props: {
      stats
    },
    revalidate: 86400
  };
}
