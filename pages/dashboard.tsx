import PageLayout from "../components/page-layout";
import AnalyticsService from "../lib/AnalyticsService";
import GitHubService from "../lib/GitHubService";
import SupabaseService from "../lib/SupabaseService";
import GoogleSearchService from "../lib/GoogleSearchService";
import StravaService from "../lib/StravaService";
import NpmService from "../lib/NpmService";
import ExternalIcon from "../components/icon-external";
import WordPressService from "../lib/WordPressService";
import TwitterService from "../lib/TwitterService";
import Counter from "../components/counter";

const Dashboard = ({ stats }) => {
  return (
    <PageLayout
      title="Dashboard"
      subtitle="The vanity metrics that mean the most to me."
    >
      <div className="post-content mx-auto prose max-w-none md:prose-lg mb-12">
        <p>
          Most of these statistics are sourced from third-party APIs. The page
          is then rendered using Vercel's{" "}
          <a
            href="https://vercel.com/docs/concepts/next.js/incremental-static-regeneration"
            target="_blank"
            rel="noreferrer"
          >
            Incremental Static Regeneration
          </a>
          , which is revalidated upon request at most once every two hours (a
          completely arbitrary interval).
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat) => {
          return (
            <li key={stat.title}>
              <div className="flex items-center">
                <h2 dangerouslySetInnerHTML={{ __html: stat.title }}></h2>

                {stat.link && (
                  <a href={stat.link} target="_blank" rel="noreferrer">
                    <ExternalIcon />
                  </a>
                )}
              </div>
              <span className="text-sm italic text-gray-500 block mb-3">
                {stat.subTitle}
              </span>
              <Counter
                value={stat.value}
                waitUntilVisible={false}
                showNumberBeforeMount={false}
                classes="text-4xl md:text-5xl font-black"
              />
            </li>
          );
        })}
      </ul>
    </PageLayout>
  );
};

export default Dashboard;

export async function getStaticProps() {
  type State = {
    title: string;
    link?: string;
    subTitle: string;
    value: number | string | Promise<number | string>;
  };

  const aService = new AnalyticsService();
  const ghService = new GitHubService();
  const supService = new SupabaseService();
  const gsService = new GoogleSearchService();
  const stravaService = new StravaService();
  const npmService = new NpmService();
  const wpService = new WordPressService();
  const twitterService = new TwitterService();

  const stats: State[] = [
    {
      title: "Total GitHub Stars",
      link: "https://github.com/alexmacarthur",
      subTitle: "If you haven't starred my repos, get on that.",
      value: ghService.getTotalsStars(),
    },
    {
      title: "Total GitHub Followers",
      link: "https://github.com/alexmacarthur",
      subTitle: "Do it yourself today, for free.",
      value: ghService.getFollowerCount(),
    },
    {
      title: "Total Twitter Followers",
      link: "https://twitter.com/amacarthur",
      subTitle: "Go ahead, follow me.",
      value: twitterService.getFollowerCount(),
    },
    {
      title: "Total Website Views",
      subTitle: "Since November, 2015.",
      value: aService.getTotalViews(),
    },
    {
      title: "Positive Feedback (👍) on Blog Posts",
      subTitle: "Scroll to the bottom of any post and do it yourself.",
      value: supService.getPositiveFeedbackCount(),
    },
    {
      title: "Links in <em>JavaScript Weekly</em>",
      link: "https://www.google.com/search?q=site%3Ajavascriptweekly.com+%22alex+macarthur%22",
      subTitle: "Mostly just blog posts, but the occassional project too.",
      value: gsService.getJsWeeklyTotalResults(),
    },
    {
      title: "Articles Published on <em>CSS Tricks</em>",
      link: "https://css-tricks.com/author/alexmacarthur",
      subTitle: "A fun privilege.",
      value: Promise.resolve(3),
    },
    {
      title: "Total Miles Run",
      link: "https://www.strava.com/athletes/27922666",
      subTitle: "As tracked by Strava since October, 2016.",
      value: stravaService.getTotalRunMiles(),
    },
    {
      title: "Total npm Downloads",
      link: "https://www.npmjs.com/~alexmacarthur",
      subTitle: "Mainly random open source JavaScript packages.",
      value: npmService.getTotalDownloads(),
    },
    {
      title: "Total WordPress Plugin Downloads",
      link: "https://github.com/alexmacarthur",
      subTitle: "Not a huge focus anymore, but still worth bragging about.",
      value: wpService.getPluginDownloadCount(),
    },
    {
      title: "How Many Inches Tall I've Grown",
      subTitle: "Expecting a growth spurt any day now.",
      value: Promise.resolve(68),
    },
    {
      title: "Enneagram Number",
      subTitle: "Probs obvious given that I have a personal dashboard.",
      value: Promise.resolve(3),
    },
  ];

  await Promise.allSettled(stats.map((stat) => stat.value));

  for (let stat of stats) {
    let result;

    try {
      result = await stat.value;

      if (!result) {
        console.log(
          `DASHBOARD - Stat value was empty: ${stat.title}, ${result}`
        );
      }

      stat.value = Number(result).toLocaleString();
    } catch (e) {
      console.log(
        `DASHBOARD - Could not get stat value: ${stat.title}, ${result}`
      );
      stat.value = null;
    }
  }

  return {
    props: {
      stats: stats.filter((s) => {
        return !!s.value;
      }),
    },
    revalidate: 7200,
  };
}
