/* eslint-disable no-undef */
module.exports = {
  root: true,
  env: {
    es2022: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
};
