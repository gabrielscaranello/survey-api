import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

const COVERAGE_PERCENT = 90

export default defineConfig({
  resolve: {
    alias: {
      '@/mocks': resolve(__dirname, 'tests/__mocks__'),
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    root: resolve(__dirname),
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      cleanOnRerun: true,
      reporter: ['text', 'html-spa', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.{d,config}.ts',
        '**/contracts/**',
        '**/{contracts,index}.ts',
        'src/main/**'
      ],
      thresholds: {
        statements: COVERAGE_PERCENT,
        branches: COVERAGE_PERCENT,
        functions: COVERAGE_PERCENT,
        lines: COVERAGE_PERCENT
      }
    }
  }
})
