import { test as base, expect, type APIRequestContext } from '@playwright/test'

const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3001'

// Gera um valor único por execução, para que os testes não dependam
// dos dados uns dos outros nem dos dados do seed.
export function unico(prefixo: string): string {
  return `${prefixo} ${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function emailUnico(prefixo = 'e2e'): string {
  return `${prefixo}.${Date.now()}.${Math.floor(Math.random() * 1000)}@teste.com`
}

type Registro = { id: string }

// Dados de teste criados e removidos pela API (sem passar pela interface).
// Tudo o que for criado ou registrado aqui é excluído ao final de cada teste.
class DadosDeTeste {
  private usuarios: string[] = []
  private categorias: string[] = []
  private tarefas: string[] = []

  constructor(private api: APIRequestContext) {}

  async criarUsuario(dados: { name: string; email: string }): Promise<Registro> {
    const res = await this.api.post(`${API_URL}/api/users`, { data: dados })
    expect(res.status(), 'falha ao preparar usuário pela API').toBe(201)
    const { data } = await res.json()
    this.usuarios.push(data.id)
    return data
  }

  async criarCategoria(dados: { name: string; description?: string }): Promise<Registro> {
    const res = await this.api.post(`${API_URL}/api/categories`, { data: dados })
    expect(res.status(), 'falha ao preparar categoria pela API').toBe(201)
    const { data } = await res.json()
    this.categorias.push(data.id)
    return data
  }

  async criarTarefa(dados: {
    title: string
    userId: string
    categoryId: string
    status?: string
    priority?: string
  }): Promise<Registro> {
    const res = await this.api.post(`${API_URL}/api/tasks`, { data: dados })
    expect(res.status(), 'falha ao preparar tarefa pela API').toBe(201)
    const { data } = await res.json()
    this.tarefas.push(data.id)
    return data
  }

  // Registra para limpeza um usuário criado pela interface (localizado pelo email)
  async registrarUsuarioPorEmail(email: string): Promise<void> {
    const res = await this.api.get(`${API_URL}/api/users`)
    const { data } = await res.json()
    const usuario = data.find((u: { email: string }) => u.email === email)
    if (usuario) this.usuarios.push(usuario.id)
  }

  // Registra para limpeza uma categoria criada pela interface (localizada pelo nome)
  async registrarCategoriaPorNome(nome: string): Promise<void> {
    const res = await this.api.get(`${API_URL}/api/categories`)
    const { data } = await res.json()
    const categoria = data.find((c: { name: string }) => c.name === nome)
    if (categoria) this.categorias.push(categoria.id)
  }

  // Remove na ordem das chaves estrangeiras: tarefas, categorias, usuários.
  // 404 é ignorado: o próprio teste pode ter excluído o registro pela interface.
  async limpar(): Promise<void> {
    for (const id of this.tarefas) await this.api.delete(`${API_URL}/api/tasks/${id}`)
    for (const id of this.categorias) await this.api.delete(`${API_URL}/api/categories/${id}`)
    for (const id of this.usuarios) await this.api.delete(`${API_URL}/api/users/${id}`)
  }
}

// Fixture "dados": disponível em todo teste como parâmetro ({ page, dados })
export const test = base.extend<{ dados: DadosDeTeste }>({
  dados: async ({ request }, fornecer) => {
    const dados = new DadosDeTeste(request)
    await fornecer(dados)
    await dados.limpar()
  }
})

export { expect }
