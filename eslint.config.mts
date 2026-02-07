import js from '@eslint/js'
import love from 'eslint-config-love'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['.yarn/*', '.pnp.*', 'coverage', 'dist', 'node_modules']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node }
  },
  tseslint.configs.recommendedTypeChecked,
  [love],
  {
    rules: {
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',

      'require-unicode-regexp': 'off'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off'
    }
  }
])
