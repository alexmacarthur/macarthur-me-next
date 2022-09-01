import Document, { Html, Head, Main, NextScript } from "next/document";
import { SITE_URL } from "../lib/constants";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="RSS 2.0 Feed"
            href={`${SITE_URL}/rss/feed.xml`}
          />
          <link
            rel="alternate"
            type="application/atom+xml"
            href={`${SITE_URL}/rss/atom.xml`}
          />
          <link
            rel="alternate"
            type="application/json"
            title="JSON Feed"
            href={`${SITE_URL}/rss/feed.json`}
          />
          <script
            defer
            data-domain="macarthur.me"
            src="/js/numbers.js"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html:
                "window.plausible = window.plausible || function() {(window.plausible.q = window.plausible.q || []).push(arguments)}",
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
