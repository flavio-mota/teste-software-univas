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

})
