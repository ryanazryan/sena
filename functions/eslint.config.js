const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = tseslint.config(
  {
    ignores: ["lib/**", "**/*.js", "eslint.config.js"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"], 
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
    },
  }
);