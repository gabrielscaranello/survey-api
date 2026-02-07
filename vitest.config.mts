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
    clearMocks: true,
    root: resolve(__dirname),
    environment: 'node',
    setupFiles: ['./setup-test/mongo-memory-server.ts'],
    coverage: {
      provider: 'istanbul',
      cleanOnRerun: true,
      reporter: ['text', 'html-spa', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.{d,config}.ts',
        '**/{contracts,types,protocols}/**',
        '**/{contracts,index,types,protocols}.ts',
        'src/main/{adapters,config,factories,server.ts}'
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
