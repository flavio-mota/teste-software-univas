# Relatório — testes unitários do frontend

## Prompt enviado ao Codex

```text
Contexto: componente frontend/src/components/Users.tsx,
requisitos RF04 e RF05 de docs/especificacao.md.
Tarefa: escreva testes em
frontend/tests/unit/Users.form.test.tsx.
Casos obrigatórios (definidos por mim):
| Req. | Mock | Ação | Esperado |
| RF04 | get -> lista vazia | clicar "Adicionar..." | Nome, Email, "Criar" |
| RF05 | get -> lista vazia | abrir, digitar, | formulário fechado |
| | | clicar "Cancelar" | |
Restrições: siga o AGENTS.md. Use getByRole ou
getByLabelText e userEvent. Não altere src/.
Se algum teste não puder passar sem alterar src/,
interrompa e explique o motivo.
Saída: execute npm test e relacione cada teste a
uma linha da tabela.
```

## Conteúdo de `frontend/tests/unit/Users.form.test.tsx`

```tsx
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
```

## Saída do `npm test` da primeira execução

Executado em `frontend/`. O teste existente `Users.error.test.tsx` passou. Os dois
testes novos falharam antes de executar suas ações: o componente lançou
`TypeError: Cannot read properties of undefined (reading 'map')` em
`Users.tsx:156`, e a consulta ao botão “Adicionar Usuário” não o encontrou.

```text
Test Files  1 failed | 1 passed (2)
Tests       2 failed | 1 passed (3)
Errors      2 errors
Duration    4.76s
```

## Saída do `npm test` após a sabotagem (“Criar” trocado por “Salvar”)

Não executada. As instruções do `AGENTS.md` proíbem alterar arquivos dentro de
`src/`, e o teste inicial já falhou na renderização antes de alcançar a asserção
do botão. Para registrar essa sabotagem seria necessário fornecer a saída de uma
execução em que o rótulo da aplicação foi alterado; não foi feita essa alteração.
