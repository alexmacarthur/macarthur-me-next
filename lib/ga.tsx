export const GA_TRACKING_ID = "UA-69526831-1";
const isProduction = process.env.NODE_ENV === "production";

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

const log = (label: string, data: any): void => {
  console.log(label, data);
}

export const gtag = function (...args: any[]): void {
  if(!isProduction) {
    log("gtag event:", args);
    return;
  }

  window['dataLayer'] = window['dataLayer'] || [];
  window['dataLayer'].push(arguments);
}

export const pageView = function (url: string): void {
  if (!isProduction) {
    log("page view event:", url);
    return;
  }

  gtag("config", GA_TRACKING_ID, {
    page_path: url
  });
};

export const event = function ({ action, category, label, value }: GTagEvent): void {
  if (!isProduction) {
    log("custom event:", arguments);
    return;
  }

  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
