const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const redirects = require("./redirects.json");

module.exports = () => {
  const plugins = [withBundleAnalyzer];

  return plugins.reduce((acc, next) => next(acc), {
    swcMinify: true,
    staticPageGenerationTimeout: 500,
    experimental: {
      legacyBrowsers: false
    },
    async rewrites() {
      return [
        {
          source: "/js/numbers.js",
          destination: "https://analytics.macarthur.me/js/plausible.js",
        },
        {
          source: "/api/event",
          destination: "https://analytics.macarthur.me/api/event",
        },
      ];
    },
    async redirects() {
      return [
        {
          source: "/typeit",
          destination: "https://typeitjs.com",
          permanent: true,
        },
        {
          source: "/posts/page/1",
          destination: "/posts",
          permanent: true,
        },
        {
          source: "/posts/lazy-load-images-in-wordpress-without-a-plugin",
          destination:
            "/posts/build-your-own-simple-lazy-loading-functionality-in-wordpress",
          permanent: true,
        },
        {
          source: "/posts/when-a-map-came-in-handy",
          destination: "/posts/when-a-weakmap-came-in-handy",
          permanent: true,
        },
        {
          source: "/bell",
          destination: "https://alexmacarthur.github.io/bell",
          permanent: true,
        },
        {
          source: "/notes/:slug*",
          destination: "/posts/:slug*",
          permanent: true,
        },
        {
          source:
            "/posts/cleaning-up-redux-store-listeners-when-component-state-updates",
          destination:
            "/posts/clean-up-your-redux-store-listeners-when-component-state-updates",
          permanent: true,
        },
        {
          source: "/posts/blog-for-your-own-sake",
          destination:
            "https://www.ramseyinhouse.com/blog/as-an-engineer-write",
          permanent: true,
        },
        {
          source: "/r/:slug",
          destination: "https://github.com/alexmacarthur/:slug",
          permanent: false,
        },
        {
          source: "/jh",
          destination:
            "https://www.gofundme.com/f/support-the-lindstrom-family-until-jonathans-home",
          permanent: false,
        },
        {
          source: "/posts/blog-for-your-own-sake",
          destination:
            "https://www.ramseyinhouse.com/blog/as-an-engineer-write",
          permanent: true,
        },
        {
          source: "/d4d",
          destination: "https://codesandbox.io/s/dev-for-designers-bare-tvqu2",
          permanent: false,
        },
        ...redirects
      ];
    },
    serverRuntimeConfig: {
      PROJECT_ROOT: __dirname,
    },
  });
};
