const withPlugins = require("next-compose-plugins");
const withLinaria = require("next-linaria");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// adapted from: https://frontend-digest.com/how-to-combine-and-use-multiple-nextjs-plugins-7425ab03c007

module.exports = withPlugins([withLinaria, withBundleAnalyzer]);
