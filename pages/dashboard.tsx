import PageLayout from "../components/page-layout";
import GoogleAnalyticsService from "../lib/GoogleAnalyticsService";
import GitHubService from "../lib/GitHubService";
import SupabaseService from "../lib/SupabaseService";
import GoogleSearchService from "../lib/GoogleSearchService";
import StravaService from "../lib/StravaService";
import NpmService from "../lib/NpmService";
import ExternalIcon from "../components/icon-external";

const Dashboard = ({ stats }) => {
  return (
    <PageLayout title="Dashboard" subTitle="The vanity metrics that mean the most to me.">

      <div className="post-content mx-auto prose max-w-none md:prose-lg mb-12">
        <p>
          Most of these statistics are sourced from third-party APIs. The page is then rendered using Vercel's <a href="https://vercel.com/docs/concepts/next.js/incremental-static-regeneration" target="_blank">Incremental Static Regeneration</a>, which is revalidated upon request at most once every hour.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map(stat => {
          return (
            <li key={stat.title}>
              <div className="flex items-center">
                <h2 dangerouslySetInnerHTML={{__html: stat.title}}></h2>

                { stat.link &&
                <>
                  <a href={stat.link} target='_blank'>
                    <ExternalIcon />
                  </a>
                </>
                }
              </div>
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
    link?: string,
    value: number | string | Promise<number | string>
  };

  const gaService = new GoogleAnalyticsService();
  const ghService = new GitHubService();
  const supService = new SupabaseService();
  const gsService = new GoogleSearchService();
  const stravaService = new StravaService();
  const npmService = new NpmService();

  const stats: State[] = [
    {
      title: 'Total GitHub Stars',
      link: "https://github.com/alexmacarthur",
      value: ghService.getTotalsStars()
    },
    {
      title: 'Total Website Views',
      value: gaService.getPageViewCount()
    },
    {
      title: 'Positive Feedback (👍) on Blog Posts',
      value: supService.getPositiveFeedbackCount()
    },
    {
      title: 'Links in <em>JavaScript Weekly</em>',
      link: "https://www.google.com/search?q=site%3Ajavascriptweekly.com+%22alex+macarthur%22",
      value: gsService.getJsWeeklyTotalResults()
    },
    {
      title: 'Articles Published on <em>CSS Tricks</em>',
      link: 'https://css-tricks.com/author/alexmacarthur',
      value: Promise.resolve(2)
    },
    {
      title: 'Total Miles Run',
      link: 'https://www.strava.com/athletes/27922666',
      value: stravaService.getTotalRunMiles()
    },
    {
      title: 'Total npm Downloads',
      link: 'https://www.npmjs.com/~alexmacarthur',
      value: npmService.getTotalDownloads()
    },
    {
      title: "How Many Inches Tall I've Grown",
      value: Promise.resolve(68)
    },
  ];

  await Promise.allSettled(stats.map(stat => stat.value));

  for(let stat of stats) {
    stat.value = (await stat.value).toLocaleString();
  }

  return {
    props: {
      stats
    },
    revalidate: 3600
  };
}
