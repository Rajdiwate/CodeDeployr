// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  // ⛔ Ignore these paths
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
    ],
  },

  // ✅ Apply rules to remaining files
  ...tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
        },
        globals: {
          ...globals.node,
          ...globals.es2021,
        },
      },
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            vars: "all",
            args: "after-used",
            ignoreRestSiblings: false,
          },
        ],
      },
    }
  ),
];
