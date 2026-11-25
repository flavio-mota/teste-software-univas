import { test, expect, unico, emailUnico } from './support/fixtures'

test('J08 recusa reabrir tarefa concluída e mantém COMPLETED após recarregar', async ({ page, dados }) => {
  test.fail(true, 'E2E-D02/RNF01: Status não está associado ao select; jornada bloqueada antes de tentar salvar')
  const titulo = unico('Tarefa concluída J08')
  const usuario = await dados.criarUsuario({ name: unico('Usuário J08'), email: emailUnico('j08') })
  const categoria = await dados.criarCategoria({ name: unico('Categoria J08') })
  await dados.criarTarefa({ title: titulo, userId: usuario.id, categoryId: categoria.id, status: 'COMPLETED' })
  await page.goto('/tasks')
  const linha = page.getByRole('row').filter({ hasText: titulo })
  await expect(linha.getByRole('cell', { name: 'COMPLETED', exact: true })).toBeVisible()
  await linha.getByRole('button', { name: 'Editar', exact: true }).click()
  await expect(page.getByLabel('Status:')).toBeVisible()
  await page.getByLabel('Status:').selectOption('PENDING')
  await page.getByRole('button', { name: 'Atualizar', exact: true }).click()
  await expect.soft(page.getByText('Erro ao salvar tarefa', { exact: true })).toBeVisible()
  await page.reload()
  await expect(linha.getByRole('cell', { name: 'COMPLETED', exact: true })).toBeVisible()
})
