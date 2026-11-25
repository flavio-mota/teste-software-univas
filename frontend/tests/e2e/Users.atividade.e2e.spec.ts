import { test, expect, unico, emailUnico } from './support/fixtures'

test.describe('Atividade E2E — usuários', () => {
  test('J03 edita o nome e mantém a alteração após recarregar', async ({ page, dados }) => {
    const nome = unico('Nome original J03')
    const novo = unico('Nome atualizado J03')
    const email = emailUnico('j03')
    await dados.criarUsuario({ name: nome, email })
    await page.goto('/users')
    const linha = page.getByRole('row').filter({ hasText: email })
    await linha.getByRole('button', { name: 'Editar', exact: true }).click()
    await expect(page.getByLabel('Nome:')).toHaveValue(nome)
    await page.getByLabel('Nome:').fill(novo)
    await page.getByRole('button', { name: 'Atualizar', exact: true }).click()
    await expect(page.getByLabel('Nome:')).toBeHidden()
    await expect(linha.getByRole('cell', { name: novo, exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: nome, exact: true })).toHaveCount(0)
    await page.reload()
    await expect(linha.getByRole('cell', { name: novo, exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: nome, exact: true })).toHaveCount(0)
  })

  for (const confirmar of [true, false]) {
    test(`J04 ${confirmar ? 'confirma exclusão e remove' : 'cancela exclusão e preserva'} o usuário após recarregar`, async ({ page, dados }) => {
      const email = emailUnico('j04')
      await dados.criarUsuario({ name: unico('Usuário J04'), email })
      await page.goto('/users')
      const linha = page.getByRole('row').filter({ hasText: email })
      await expect(linha).toBeVisible()
      let dialogos = 0
      page.once('dialog', async (dialogo) => {
        dialogos++
        if (confirmar) await dialogo.accept()
        else await dialogo.dismiss()
      })
      await linha.getByRole('button', { name: 'Excluir', exact: true }).click()
      await expect.poll(() => dialogos).toBe(1)
      if (confirmar) await expect(linha).toHaveCount(0)
      else await expect(linha).toBeVisible()
      await page.reload()
      await expect(page.getByRole('heading', { name: 'Usuários', exact: true })).toBeVisible()
      if (confirmar) await expect(linha).toHaveCount(0)
      else await expect(linha).toBeVisible()
    })
  }

  test('J07 informa email já cadastrado e preserva usuário e formulário', async ({ page, dados }) => {
    test.fail(true, 'E2E-D03/J07: aparece Erro ao salvar usuário em vez de Email já cadastrado')
    const email = emailUnico('j07')
    const nome = unico('Usuário original J07')
    await dados.criarUsuario({ name: nome, email })
    await page.goto('/users')
    await page.getByRole('button', { name: 'Adicionar Usuário' }).click()
    await page.getByLabel('Nome:').fill('Tentativa duplicada')
    await page.getByLabel('Email:').fill(email)
    await page.getByRole('button', { name: 'Criar', exact: true }).click()
    await expect.soft(page.getByText('Email já cadastrado', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Nome:')).toHaveValue('Tentativa duplicada')
    await expect(page.getByLabel('Email:')).toHaveValue(email)
    await page.reload()
    const linha = page.getByRole('row').filter({ hasText: email })
    await expect(linha).toHaveCount(1)
    await expect(linha.getByRole('cell', { name: nome, exact: true })).toBeVisible()
  })
})
