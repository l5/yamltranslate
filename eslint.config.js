import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { ESLint } from "eslint";

export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  new ESLint({
    overrideConfig: {
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
      ],
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module"
      },
      rules: {
        // Add your custom rules here
      }
    },
    extensions: [".ts"]
  })
];