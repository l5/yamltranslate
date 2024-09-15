import globals from "globals";
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node,
      parser: parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": ts
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      // Add your custom rules here
    }
  }
];