// eslint.config.js
import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      // твои правила
    },
    ignores: ['**/node_modules/*', '**/dist/*', '**/coverage/*', '**/.env*'],
  },
  prettier,
]
