import { google } from 'googleapis';
import gaData from './ga-data.json';

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const jwt = new google.auth.JWT(process.env.GA_CLIENT_EMAIL, null, process.env.GA_PRIVATE_KEY, scopes);

// Documentation: 
// https://developers.google.com/analytics/devguides/reporting/core/v3/reference

class GoogleAnalyticsService {
  gaData;

  constructor() {
    this.gaData = gaData;
  }

  log(message) {
    console.log(`ANALYTICS SERVICE LOG - ${message}`);
  }

  async getPageViewCount(): Promise<number> {
    return Number(this.gaData.totalPageViewsForSite);
  }

  async getPostViews(slug: string): Promise<null | string> {
    const rawValue = this.gaData.postViewCounts[slug];
    
    return Number(rawValue).toLocaleString();
  }
}

export default GoogleAnalyticsService;
