import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import Users from '../../src/components/Users'
import { server } from '../msw/server'

// Exemplo de referência (escrito à mão) para a aula de testes de integração.
// Requisito RF02 + contrato API02 (docs/especificacao.md): a resposta de
// GET /api/users tem o formato { success, count, data } e cada usuário
// aparece em uma linha da tabela com nome, email e quantidade de tarefas.
describe('Users + API — carregamento da lista (RF02 / API02)', () => {
  it('exibe os usuários devolvidos por GET /api/users', async () => {
    // Arrange: a "API" responde no formato definido pelo contrato API02
    server.use(
      http.get('*/api/users', () =>
        HttpResponse.json({
          success: true,
          count: 1,
          data: [
            {
              id: 'u1',
              name: 'Ana Souza',
              email: 'ana@email.com',
              createdAt: '2026-11-01T10:00:00.000Z',
              tasks: []
            }
          ]
        })
      )
    )

    // Act: o componente faz a requisição HTTP real (Axios), interceptada pelo MSW
    render(<Users />)

    // Assert: a linha da tabela mostra os dados recebidos
    const linha = (await screen.findByText('Ana Souza')).closest('tr')!
    expect(within(linha).getByText('ana@email.com')).toBeInTheDocument()
    expect(within(linha).getByText('0')).toBeInTheDocument()
  })
})
