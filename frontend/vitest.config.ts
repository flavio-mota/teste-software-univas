import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // O jsdom aplica a política de CORS do navegador. A página simulada usa a
      // mesma origem da API (VITE_API_URL padrão) para que as respostas do MSW
      // nos testes de integração não sejam bloqueadas como requisições cross-origin.
      environmentOptions: { jsdom: { url: 'http://localhost:3001' } },
      include: ['tests/**/*.test.{ts,tsx}'],
      setupFiles: ['./tests/setup.ts'],
      restoreMocks: true,
      passWithNoTests: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/main.tsx', 'src/vite-env.d.ts'],
        reporter: ['text', 'html']
      }
    }
  })
)
