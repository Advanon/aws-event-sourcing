module.exports = {
  env: {
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-multiple-empty-lines": "error",
    "eol-last": ["error", "always"]
  }
};
