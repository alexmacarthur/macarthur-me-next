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
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      return config
    },
    future: {
      webpack5: true,
    }
  });
