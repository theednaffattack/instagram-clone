const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  extends: [
    "eslint:recommended",
    "standard",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    // "prettier/@typescript-eslint"
  ],
  plugins: ["@typescript-eslint"],
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ["dist", "node_modules", "examples", "scripts"],
  rules: {
    "dot-notation": OFF,
    camelcase: WARN,
  },
};
