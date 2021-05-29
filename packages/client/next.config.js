const withCSS = require("@zeit/next-css");
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

module.exports = withCSS({
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
            ...(config.linaria || {}),
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
            ...(config.linaria || {}),
            extension: ".css",
          },
        },
      ],
    });

    if (typeof config.webpack === "function") {
      return config.webpack(config, options);
    }
    return config;
  },
});

// // old linaria config from linaria docs
// module.exports = withCSS({
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.(js|jsx|ts|tsx)$/, // /\.tsx$/,
//       use: [
//         {
//           loader: "linaria/loader",
//           options: {
//             sourceMap: process.env.NODE_ENV !== "production",
//           },
//         },
//       ],
//     });

//     return config;
//   },
// });

// const withLinaria = require("next-linaria");

// module.exports = withLinaria({
//   webpack(config, options) {
//     traverse(config.module.rules);
//     config.module.rules.push({
//       test: /(?!_app)\.(tsx|ts|js|mjs|jsx)$/,
//       exclude: /node_modules/,
//       use: [
//         {
//           loader: require.resolve("@linaria/webpack-loader"),
//           options: {
//             sourceMap: process.env.NODE_ENV !== "production",
//             ...(config.linaria || {}),
//             extension: LINARIA_EXTENSION,
//           },
//         },
//       ],
//     });
//     config.module.rules.push({
//       test: /_app\.(tsx|ts|js|mjs|jsx)$/,
//       exclude: /node_modules/,
//       use: [
//         {
//           loader: require.resolve("@linaria/webpack-loader"),
//           options: {
//             sourceMap: process.env.NODE_ENV !== "production",
//             ...(config.linaria || {}),
//             extension: ".css",
//           },
//         },
//       ],
//     });

//     if (typeof config.webpack === "function") {
//       return config.webpack(config, options);
//     }
//     return config;
//   },
// });
