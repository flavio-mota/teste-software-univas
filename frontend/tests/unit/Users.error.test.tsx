import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Users from '../../src/components/Users'
import { api } from '../../src/services/api'

// Exemplo de referência (escrito à mão) para a aula de testes unitários do frontend.
// Requisito RF03 (docs/especificacao.md): se a API falhar ao listar usuários,
// a mensagem "Erro ao carregar usuários" é exibida.
describe('Users — falha no carregamento (RF03)', () => {
  it('exibe mensagem de erro quando a API falha', async () => {
    // Arrange: a chamada GET /users é substituída por uma promessa rejeitada
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Network error'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Act
    render(<Users />)

    // Assert: findByText aguarda a atualização assíncrona do componente
    expect(await screen.findByText('Erro ao carregar usuários')).toBeInTheDocument()
  })
})
