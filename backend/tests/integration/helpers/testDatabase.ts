// URL do banco usado EXCLUSIVAMENTE pelos testes de integração.
// Fora do Docker (terminal do Mac/Windows), o PostgreSQL do docker-compose
// responde em localhost:5432. Dentro do container, use TEST_DATABASE_URL
// (definida no docker-compose.yml com o host "postgres").
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres:postgres123@localhost:5432/teste_software_test_db'

// Trava de segurança: os testes apagam todas as tabelas antes de cada caso.
// Se a URL não apontar para um banco de teste, a execução é interrompida
// para não destruir os dados do banco de desenvolvimento.
export function assertTestDatabase(url: string | undefined): void {
  const dbName = url ? new URL(url).pathname.replace('/', '') : ''
  if (!dbName.endsWith('_test_db')) {
    throw new Error(
      `Testes de integração recusados: o banco "${dbName}" não é um banco de teste (*_test_db).`
    )
  }
}
