import { defineConfig } from 'vitest/config'
import { TEST_DATABASE_URL } from './tests/integration/helpers/testDatabase'

// Testes de integração: usam o PostgreSQL real (banco de teste separado).
// Execução: npm run test:integration (o container postgres precisa estar ativo).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.int.test.ts'],
    globalSetup: ['./tests/integration/helpers/globalSetup.ts'],
    env: { DATABASE_URL: TEST_DATABASE_URL, NODE_ENV: 'test' },
    // Todos os arquivos compartilham o mesmo banco: execução em sequência
    fileParallelism: false,
    hookTimeout: 60000,
    passWithNoTests: true
  }
})
