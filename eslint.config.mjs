import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import * as nodeDependenciesPlugin from 'eslint-plugin-node-dependencies'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginYaml from 'eslint-plugin-yaml'
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended'

const JS_TS_FILES = ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
const REACT_FILES = ['**/*.{jsx,tsx}']

function scopeConfigs(configs, files) {
  return configs.map((config) => ({
    ...config,
    files,
  }))
}

export default defineConfig([
  {
    files: JS_TS_FILES,
    plugins: { js, 'simple-import-sort': simpleImportSort },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  ...scopeConfigs(tseslint.configs.recommended, JS_TS_FILES),
  {
    ...pluginReact.configs.flat.recommended,
    files: REACT_FILES,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ...pluginReact.configs.flat['jsx-runtime'],
    files: REACT_FILES,
  },
  {
    ...eslintPluginUnicorn.configs.all,
    files: JS_TS_FILES,
  },
  ...scopeConfigs(
    nodeDependenciesPlugin.configs['flat/recommended'],
    JS_TS_FILES
  ),
  pluginYaml.configs.recommended,
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
  prettierConfigRecommended,
])
