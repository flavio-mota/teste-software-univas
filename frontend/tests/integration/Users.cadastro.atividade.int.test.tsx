import { describe, it, expect } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import Users from '../../src/components/Users'
import { server } from '../msw/server'

const dados = { name: 'Sergio Borges', email: 'sergio@example.com' }
const usuario = { ...dados, id: 'usuario-atividade', createdAt: '2026-11-25T12:00:00.000Z', tasks: [] }

async function preencherFormulario() {
  const user = userEvent.setup()
  render(<Users />)
  await user.click(await screen.findByRole('button', { name: 'Adicionar Usuário' }))
  await user.type(screen.getByLabelText('Nome:'), dados.name)
  await user.type(screen.getByLabelText('Email:'), dados.email)
  return user
}

describe('Cadastro de usuários — RF08 / RF09 / API01 / API02', () => {
  it('envia os dados, fecha o formulário e recarrega a lista após criar', async () => {
    // Arrange: estado da API só muda após receber o POST.
    let criado = false
    const corpos: unknown[] = []
    let leiturasAposPost = 0
    server.use(
      http.get('*/api/users', () => {
        if (criado) leiturasAposPost++
        return HttpResponse.json({ success: true, count: criado ? 1 : 0, data: criado ? [usuario] : [] })
      }),
      http.post('*/api/users', async ({ request }) => {
        corpos.push(await request.json())
        criado = true
        return HttpResponse.json({ success: true, data: usuario }, { status: 201 })
      }),
    )
    // Act
    const user = await preencherFormulario()
    await user.click(screen.getByRole('button', { name: 'Criar', exact: true }))
    // Assert
    const linha = await screen.findByRole('row', { name: /Sergio Borges/ })
    expect(within(linha).getByText(dados.email)).toBeInTheDocument()
    expect(within(linha).getByText('0')).toBeInTheDocument()
    expect(corpos).toEqual([dados])
    expect(leiturasAposPost).toBe(1)
    expect(screen.queryByLabelText('Nome:')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Email:')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Criar', exact: true })).not.toBeInTheDocument()
  })

  // D06: interface exibe "Erro ao salvar usuário" em vez da mensagem da RF09.
  it.fails('exibe Email já cadastrado e mantém os dados após resposta 409', async () => {
    const corpos: unknown[] = []
    server.use(
      http.get('*/api/users', () => HttpResponse.json({ success: true, count: 1, data: [usuario] })),
      http.post('*/api/users', async ({ request }) => {
        corpos.push(await request.json())
        return HttpResponse.json({ success: false, error: 'Email já cadastrado' }, { status: 409 })
      }),
    )
    const user = await preencherFormulario()
    await user.click(screen.getByRole('button', { name: 'Criar', exact: true }))
    await waitFor(() => expect(corpos).toEqual([dados]))
    expect(screen.getByLabelText('Nome:')).toHaveValue(dados.name)
    expect(screen.getByLabelText('Email:')).toHaveValue(dados.email)
    expect(screen.getByRole('button', { name: 'Criar', exact: true })).toBeInTheDocument()
    expect(screen.getAllByRole('row', { name: /Sergio Borges/ })).toHaveLength(1)
    expect(await screen.findByText('Email já cadastrado')).toBeInTheDocument()
  })
})
