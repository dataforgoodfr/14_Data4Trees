import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import eslintJson from "@eslint/json";
import pluginPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js: eslintJs },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      eslintReact.configs["recommended-typescript"],
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    rules: {
      /**
       * Disable some opiniated rules...
       */
      // "In React 19, 'use' is preferred over 'useContext' because it is more flexible"
      "@eslint-react/no-use-context": "off",
      // "In React 19, 'forwardRef' is no longer necessary. Pass 'ref' as a prop instead"
      "@eslint-react/no-forward-ref": "off",
      // "In React 19, you can render '<Context>' as a provider instead of '<Context.Provider>'"
      "@eslint-react/no-context-provider": "off"
    },
    // Configure language/parsing options
    languageOptions: {
      // Use TypeScript ESLint parser for TypeScript files
      parser: tseslint.parser,
      parserOptions: {
        // Enable project service for better TypeScript integration
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
    plugins: { json: eslintJson },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    /** @ts-expect-error json plugin not typed well*/
    plugins: { json: eslintJson },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  pluginPrettier,
]);
