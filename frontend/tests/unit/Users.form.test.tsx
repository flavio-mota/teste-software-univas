import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Users from '../../src/components/Users'
import { api } from '../../src/services/api'

describe('RF04 - Abertura do formulário de usuário', () => {
  it('exibe o botão Criar ao clicar em Adicionar Usuário', async () => {
    // Arrange
    vi.spyOn(api, 'get').mockResolvedValue({ data: { data: [] } })
    const user = userEvent.setup()
    render(<Users />)
    const adicionar = await screen.findByRole('button', { name: 'Adicionar Usuário' })
    expect(screen.queryByRole('button', { name: 'Criar' })).toBe(null)

    // Act
    await user.click(adicionar)

    // Assert
    expect(screen.getByRole('button', { name: 'Criar' }).textContent?.trim()).toBe('Criar')
  })

  // D-F01: falhas confirmadas antes da marcação; não alterar src/ nesta atividade.
  it.fails.each(['Nome:', 'Email:'])('exibe o campo identificado pelo rótulo %s ao abrir o formulário', async (rotulo) => {
    // Arrange
    vi.spyOn(api, 'get').mockResolvedValue({ data: { data: [] } })
    const user = userEvent.setup()
    render(<Users />)
    const adicionar = await screen.findByRole('button', { name: 'Adicionar Usuário' })

    // Act
    await user.click(adicionar)

    // Assert: RF04 exige campos identificáveis pelos rótulos (defeito D-F01).
    expect(screen.getByLabelText<HTMLInputElement>(rotulo).value).toBe('')
  })
})
