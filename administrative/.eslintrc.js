module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
  },

  extends: ["eslint:recommended", "standard", "prettier", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ["dist", "node_modules", "examples", "scripts"],
};
