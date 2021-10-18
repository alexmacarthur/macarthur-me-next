import { google } from 'googleapis';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const jwt = new google.auth.JWT(process.env.GA_CLIENT_EMAIL, null, process.env.GA_PRIVATE_KEY, scopes);

// Documentation: 
// https://developers.google.com/analytics/devguides/reporting/core/v3/reference

class GoogleAnalyticsService {

  log(message) {
    console.log(`GOOGLE ANALYTICS SERVICE LOG - ${message}`);
  }

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

  async getPostViews(slug: string): Promise<null | string> {
    if(process.env.NODE_ENV !== 'production') {
      return Number(99999).toLocaleString();
    }

    try {
      const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': `ga:${process.env.GA_VIEW_ID}`,
        'start-date': "2012-01-01",
        'end-date': 'today',
        'metrics': 'ga:pageviews',
        'dimensions': 'ga:pagePath',
        'filters': `ga:pagePath=@${slug}`
      });
  
      // Something went wrong.
      if (!String(result.status).startsWith('20')) {
        return null;
      }
  
      const total = result.data?.totalsForAllResults
  
      return total ? Number(total).toLocaleString() : null;
    } catch(e) {
      this.log(e.message);
      return null;
    }
  }
}

export default GoogleAnalyticsService;
