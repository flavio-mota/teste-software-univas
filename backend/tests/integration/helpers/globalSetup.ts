import { execSync } from 'node:child_process'
import { TEST_DATABASE_URL, assertTestDatabase } from './testDatabase'

// Executado uma vez, antes de todos os arquivos de teste de integração:
// cria (ou recria do zero) o banco de teste com o schema atual do Prisma.
export default function setup() {
  assertTestDatabase(TEST_DATABASE_URL)
  execSync('npx prisma db push --force-reset --skip-generate', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL }
  })
}
