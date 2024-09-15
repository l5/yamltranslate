import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import globals from "globals";
import { Linter } from "eslint";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
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
      ...Linter.rules,
      ...ts.configs.recommended.rules,
      // Add your custom rules here
    }
  }
];