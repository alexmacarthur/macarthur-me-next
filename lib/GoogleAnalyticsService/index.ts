import { google } from 'googleapis';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

const jwt = new google.auth.JWT(process.env.GA_CLIENT_EMAIL, null, process.env.GA_PRIVATE_KEY, scopes);

const GoogleAnalyticsService = async () => {
  const view_id = '110951246';

  async function getData() {
    const result = await google.analytics('v3').data.ga.get({
      'auth': jwt,
      'ids': 'ga:' + view_id,
      // 'start-date': '30daysAgo',
      'start-date': '2012-01-01',
      'end-date': 'today',
      'metrics': 'ga:pageviews'
    });

    return result;
  }

  console.log(await getData());
}

export default GoogleAnalyticsService;
