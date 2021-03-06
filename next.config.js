const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withPlugins(
  [
    [optimizedImages, {}],
    // [withPreact, {}],
    [withBundleAnalyzer, {}]
  ], {
  // basePath: "https://macarthur.me/",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config
  },
  future: {
    webpack5: true,
  },
  async redirects() {
    return [
      {
        source: "/typeit",
        destination: "https://typeitjs.com",
        permanent: true
      },
      {
        source: "/posts/page/1",
        destination: "/posts",
        permanent: true
      },
      {
        source: "/posts/lazy-load-images-in-wordpress-without-a-plugin",
        destination: "/posts/build-your-own-simple-lazy-loading-functionality-in-wordpress",
        permanent: true
      },
      {
        source: "/bell",
        destination: "https://alexmacarthur.github.io/bell",
        permanent: true
      },
      {
        source: "/notes/:slug*",
        destination: "/posts/:slug*",
        permanent: true
      },
      {
        source: "/posts/cleaning-up-redux-store-listeners-when-component-state-updates",
        destination: "/posts/clean-up-your-redux-store-listeners-when-component-state-updates",
        permanent: true
      },
      {
        source: "/posts/blog-for-your-own-sake",
        destination: "https://www.ramseyinhouse.com/blog/as-an-engineer-write",
        permanent: true
      },
      {
        source: "/r/:slug",
        destination: "https://github.com/alexmacarthur/:slug",
        permanent: false
      },
      {
        source: "/jh",
        destination: "https://www.gofundme.com/f/support-the-lindstrom-family-until-jonathans-home",
        permanent: false
      },
      {
        source: "/posts/blog-for-your-own-sake",
        destination: "https://www.ramseyinhouse.com/blog/as-an-engineer-write",
        permanent: true
      },
    ]
  },
});
