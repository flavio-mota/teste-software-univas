import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // Testes unitários apenas; integração: vitest.integration.config.ts
    include: ['tests/unit/**/*.test.ts'],
    restoreMocks: true,
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts'],
      reporter: ['text', 'html']
    }
  }
})
