const withPlugins = require("next-compose-plugins");
const withLinaria = require("next-linaria");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins([withLinaria, withBundleAnalyzer]);
