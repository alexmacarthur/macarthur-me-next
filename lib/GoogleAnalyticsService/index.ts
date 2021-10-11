import { google } from 'googleapis';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const jwt = new google.auth.JWT(process.env.GA_CLIENT_EMAIL, null, process.env.GA_PRIVATE_KEY, scopes);

class GoogleAnalyticsService {
  async getPageViews(startDate: string = "2012-01-01"): Promise<any> {
    const result = await google.analytics('v3').data.ga.get({
      'auth': jwt,
      'ids': `ga:${process.env.GA_VIEW_ID}`,
      'start-date': startDate,
      'end-date': 'today',
      'metrics': 'ga:pageviews'
    });

    return result.data;
  }

  async getPageViewCount(): Promise<number> {
    return Number((await this.getPageViews()).totalsForAllResults['ga:pageviews']);
  }
}

export default GoogleAnalyticsService;
