import { test, expect, unico, emailUnico } from './support/fixtures'

test.describe('Atividade E2E — categorias', () => {
  test('J05 cadastra categoria com descrição e comprova persistência', async ({ page, dados }) => {
    test.fail(true, 'E2E-D01/RNF01: os campos de categoria não estão associados aos rótulos; falha comprovada na execução inicial')
    const nome = unico('Categoria criada J05')
    const descricao = 'Descrição da atividade E2E'
    try {
      await page.goto('/categories')
      await page.getByRole('button', { name: 'Adicionar Categoria' }).click()
      await expect(page.getByLabel('Nome:')).toBeVisible()
      await page.getByLabel('Nome:').fill(nome)
      await page.getByLabel('Descrição:').fill(descricao)
      const resposta = page.waitForResponse(res => res.url().endsWith('/api/categories') && res.request().method() === 'POST')
      await page.getByRole('button', { name: 'Criar', exact: true }).click()
      await resposta
      await dados.registrarCategoriaPorNome(nome)
      await expect(page.getByRole('button', { name: 'Criar', exact: true })).toBeHidden()
      const linha = page.getByRole('row').filter({ hasText: nome })
      await expect(linha.getByRole('cell', { name: descricao, exact: true })).toBeVisible()
      await page.reload()
      await expect(linha.getByRole('cell', { name: descricao, exact: true })).toBeVisible()
    } finally {
      await dados.registrarCategoriaPorNome(nome)
    }
  })

  test('J05 edita nome e descrição e mantém os novos dados após recarregar', async ({ page, dados }) => {
    test.fail(true, 'E2E-D01/RNF01: getByLabel não encontra os campos de categoria; jornada bloqueada antes de salvar')
    const nome = unico('Categoria original J05')
    const novo = unico('Categoria editada J05')
    await dados.criarCategoria({ name: nome, description: 'Descrição original' })
    await page.goto('/categories')
    await page.getByRole('row').filter({ hasText: nome }).getByRole('button', { name: 'Editar', exact: true }).click()
    await expect(page.getByLabel('Nome:')).toHaveValue(nome)
    await expect(page.getByLabel('Descrição:')).toHaveValue('Descrição original')
    await page.getByLabel('Nome:').fill(novo)
    await page.getByLabel('Descrição:').fill('Descrição atualizada')
    await page.getByRole('button', { name: 'Atualizar', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Atualizar', exact: true })).toBeHidden()
    const linha = page.getByRole('row').filter({ hasText: novo })
    await expect(linha.getByRole('cell', { name: 'Descrição atualizada', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: nome, exact: true })).toHaveCount(0)
    await page.reload()
    await expect(linha.getByRole('cell', { name: 'Descrição atualizada', exact: true })).toBeVisible()
    await expect(page.getByRole('cell', { name: nome, exact: true })).toHaveCount(0)
  })

  for (const confirmar of [true, false]) {
    test(`J05 ${confirmar ? 'confirma exclusão de' : 'cancela exclusão e preserva'} categoria vazia após recarregar`, async ({ page, dados }) => {
      const nome = unico('Categoria exclusão J05')
      await dados.criarCategoria({ name: nome })
      await page.goto('/categories')
      const linha = page.getByRole('row').filter({ hasText: nome })
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
      await expect(page.getByRole('heading', { name: 'Categorias', exact: true })).toBeVisible()
      if (confirmar) await expect(linha).toHaveCount(0)
      else await expect(linha).toBeVisible()
    })
  }

  test('J06 recusa excluir categoria em uso e mantém categoria e tarefa', async ({ page, dados }) => {
    const nome = unico('Categoria em uso J06')
    const titulo = unico('Tarefa J06')
    const usuario = await dados.criarUsuario({ name: unico('Usuário J06'), email: emailUnico('j06') })
    const categoria = await dados.criarCategoria({ name: nome })
    await dados.criarTarefa({ title: titulo, userId: usuario.id, categoryId: categoria.id })
    await page.goto('/categories')
    const linha = page.getByRole('row').filter({ hasText: nome })
    await expect(linha).toBeVisible()
    page.once('dialog', dialogo => dialogo.accept())
    await linha.getByRole('button', { name: 'Excluir', exact: true }).click()
    await expect.soft(page.getByText('Erro ao excluir categoria', { exact: true })).toBeVisible()
    await expect.soft(linha).toBeVisible()
    await page.reload()
    await expect.soft(linha).toBeVisible()
    await page.goto('/tasks')
    await expect(page.getByRole('row').filter({ hasText: titulo })).toBeVisible()
  })
})
