import { test, expect, emailUnico } from './support/fixtures'

// Exemplo de referência (escrito à mão) para a aula de testes E2E.
// Jornada J02 (docs/especificacao.md): cadastro de usuário pela interface.
test.describe('J02 — Cadastro de usuário', () => {
  test('cria um usuário pela tela e ele continua na lista após recarregar', async ({
    page,
    dados
  }) => {
    const email = emailUnico('j02')

    // Usuário percorre a jornada pela interface
    await page.goto('/users')
    await page.getByRole('button', { name: 'Adicionar Usuário' }).click()
    await page.getByLabel('Nome:').fill('Aluno E2E')
    await page.getByLabel('Email:').fill(email)
    await page.getByRole('button', { name: 'Criar' }).click()

    // Registra o usuário criado para ser excluído ao final do teste
    await dados.registrarUsuarioPorEmail(email)

    // Resultado visível: o formulário fecha e o usuário aparece na lista
    await expect(page.getByRole('button', { name: 'Criar' })).toBeHidden()
    const linha = page.getByRole('row').filter({ hasText: email })
    await expect(linha).toContainText('Aluno E2E')

    // Persistência: após recarregar, o dado vem do banco, não do estado da tela
    await page.reload()
    await expect(page.getByRole('row').filter({ hasText: email })).toBeVisible()
  })
})
