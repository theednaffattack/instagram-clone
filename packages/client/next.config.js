// const withCSS = require("@zeit/next-css");

// const withLinaria = require("next-linaria");

// module.exports = withLinaria({});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const LINARIA_EXTENSION = ".linaria.module.css";

function traverse(rules) {
  for (let rule of rules) {
    if (typeof rule.loader === "string" && rule.loader.includes("css-loader")) {
      if (
        rule.options &&
        rule.options.modules &&
        typeof rule.options.modules.getLocalIdent === "function"
      ) {
        let nextGetLocalIdent = rule.options.modules.getLocalIdent;
        rule.options.modules.mode = "local";
        rule.options.modules.auto = true;
        rule.options.modules.exportGlobals = true;
        rule.options.modules.exportOnlyLocals = false;
        rule.options.modules.getLocalIdent = (
          context,
          _,
          exportName,
          options
        ) => {
          if (context.resourcePath.includes(LINARIA_EXTENSION)) {
            return exportName;
          }
          return nextGetLocalIdent(context, _, exportName, options);
        };
      }
    }
    if (typeof rule.use === "object") {
      traverse(Array.isArray(rule.use) ? rule.use : [rule.use]);
    }
    if (Array.isArray(rule.oneOf)) {
      traverse(rule.oneOf);
    }
  }
}

module.exports = withBundleAnalyzer((nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      traverse(config.module.rules);
      config.module.rules.push({
        test: /(?!_app)\.(tsx|ts|js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("@linaria/webpack-loader"),
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
              ...(nextConfig.linaria || {}),
              extension: LINARIA_EXTENSION,
            },
          },
        ],
      });
      config.module.rules.push({
        test: /_app\.(tsx|ts|js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("@linaria/webpack-loader"),
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
              ...(nextConfig.linaria || {}),
              extension: ".css",
            },
          },
        ],
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      return config;
    },
  };
});
