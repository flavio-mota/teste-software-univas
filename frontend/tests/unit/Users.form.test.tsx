import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Users from '../../src/components/Users'
import { api } from '../../src/services/api'

describe('Users — formulário (RF04 e RF05)', () => {
  it('RF04: exibe Nome, Email e Criar ao clicar em Adicionar Usuário', async () => {
    // Arrange
    const user = userEvent.setup()
    vi.spyOn(api, 'get').mockResolvedValue({ data: [] })
    render(<Users />)

    // Act
    await user.click(await screen.findByRole('button', { name: /Adicionar Usuário/i }))

    // Assert
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument()
  })

  it('RF05: fecha o formulário ao cancelar e limpa os campos', async () => {
    // Arrange
    const user = userEvent.setup()
    vi.spyOn(api, 'get').mockResolvedValue({ data: [] })
    render(<Users />)
    await user.click(await screen.findByRole('button', { name: /Adicionar Usuário/i }))
    const nameInput = screen.getByLabelText('Nome')
    const emailInput = screen.getByLabelText('Email')
    await user.type(nameInput, 'Ana')
    await user.type(emailInput, 'ana@example.com')

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert: o formulário fecha; ao reabri-lo, os campos estão limpos.
    expect(screen.queryByLabelText('Nome')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Adicionar Usuário/i }))
    expect(screen.getByLabelText('Nome')).toHaveValue('')
    expect(screen.getByLabelText('Email')).toHaveValue('')
  })
})
