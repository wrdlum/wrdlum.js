import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import * as nodeDependenciesPlugin from 'eslint-plugin-node-dependencies';
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import pluginYaml from 'eslint-plugin-yaml';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const JS_TS_FILES = ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'];
const REACT_FILES = ['**/*.{jsx,tsx}'];
const YAML_FILES = ['**/*.{yaml,yml}'];

/**
 * Utility to apply file patterns to a config or an array of configs.
 */
function scopeConfigs(configs, files) {
  const configsArray = Array.isArray(configs) ? configs : [configs];
  return configsArray.map((config) => ({
    ...config,
    files,
  }));
}

export default defineConfig([
  // 1. Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '.turbo/**',
      'pnpm-lock.yaml',
    ],
  },

  // 2. Base & Third-party configs (Correttamente scoped)
  ...scopeConfigs(js.configs.recommended, JS_TS_FILES),
  ...scopeConfigs(tseslint.configs.recommended, JS_TS_FILES),
  ...scopeConfigs(pluginReact.configs.flat.recommended, REACT_FILES),
  ...scopeConfigs(pluginReact.configs.flat['jsx-runtime'], REACT_FILES),
  ...scopeConfigs(eslintPluginUnicorn.configs.all, JS_TS_FILES),
  ...scopeConfigs(
    nodeDependenciesPlugin.configs['flat/recommended'],
    JS_TS_FILES
  ),
  ...scopeConfigs(pluginYaml.configs.recommended, YAML_FILES),

  // 3. Custom Rules & Sorting (Vince se applicato dopo gli altri)
  {
    files: JS_TS_FILES,
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
      },
      // Assicura che venga usato il parser di TypeScript
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Regole stilistiche forzate
      semi: ['error', 'always'],
      'no-extra-semi': 'error',

      // Configurazione Unicorn (permette req, res, err)
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            req: true,
            res: true,
            err: true,
          },
        },
      ],

      'sort-imports': 'off',
      'import/order': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Dotenv packages
            ['^@dotenvx/dotenvx', '^dotenv'],
            // 2. Polyfills, node:*, and built-ins
            [
              String.raw`^\u0000`,
              '^node:',
              '^(?:assert|async_hooks|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|http2|https|inspector|module|net|os|path|perf_hooks|process|punycode|querystring|readline|repl|stream|string_decoder|timers|tls|trace_events|tty|url|util|v8|vm|wasi|worker_threads|zlib)(?:/|$)',
            ],
            // 3. Express framework
            ['^express$'],
            // 4. Common Express middlewares
            [
              '^cors',
              '^helmet',
              '^morgan',
              '^body-parser',
              '^cookie-parser',
              '^compression',
              '^express-rate-limit',
              '^hpp',
              '^multer',
              '^passport',
              '^express-session',
            ],
            // 5. Other external packages (non-relative)
            ['^[^.]'],
            // 6. Relative imports
            [String.raw`^\.`],
          ],
        },
      ],
    },
  },

  // 4. Language specific configs (JSON, MD, CSS)
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },

  // 5. Prettier (sempre ultimo)
  prettierConfigRecommended,
]);
