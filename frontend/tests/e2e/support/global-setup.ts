// Executado uma vez antes dos testes E2E: falha rapidamente, com uma mensagem
// clara, se a aplicação não estiver em execução.
const FRONTEND_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3001'

async function verificar(nome: string, url: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch (error) {
    throw new Error(
      `${nome} não está respondendo em ${url}. ` +
        'Suba a aplicação com: docker compose up -d (e aguarde alguns segundos).\n' +
        `Detalhe: ${(error as Error).message}`,
      { cause: error }
    )
  }
}

export default async function globalSetup() {
  await verificar('O backend', `${API_URL}/health`)
  await verificar('O frontend', FRONTEND_URL)
}
