import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

import js from "@eslint/js";
import json from "@eslint/json";
import pluginPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      /**
       * Disable react/display-name since it's currently broken
       * TypeError: Error while loading rule 'react/display-name': sourceCode.getAllComments is not a function
       */
      "react/display-name": ["off"],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.json"],
    /** @ts-expect-error json plugin not typed well*/
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    /** @ts-expect-error json plugin not typed well*/
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  pluginPrettier,
]);
