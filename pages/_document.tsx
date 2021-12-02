import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
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
