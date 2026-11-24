import { defineConfig, devices } from '@playwright/test'

// Testes E2E: a aplicação completa (frontend + backend + PostgreSQL) precisa estar
// em execução no Docker (docker compose up -d). O Playwright roda na máquina local.
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.spec.ts',
  // Verifica, antes de tudo, se frontend e backend estão respondendo
  globalSetup: './tests/e2e/support/global-setup.ts',
  // Os testes compartilham o mesmo banco da aplicação: execução em sequência
  fullyParallel: false,
  workers: 1,
  // Sem novas tentativas: um teste intermitente deve aparecer como falha, não ser escondido
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
})
