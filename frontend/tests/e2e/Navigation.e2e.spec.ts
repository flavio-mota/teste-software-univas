import { test, expect } from './support/fixtures'

// Exemplo de referência (escrito à mão) para a aula de testes E2E.
// Jornada J01 (docs/especificacao.md): navegação a partir do Dashboard.
test.describe('J01 — Navegação', () => {
  const destinos = [
    { link: 'Usuários', url: /\/users$/, titulo: 'Usuários' },
    { link: 'Tarefas', url: /\/tasks$/, titulo: 'Tarefas' },
    { link: 'Categorias', url: /\/categories$/, titulo: 'Categorias' }
  ]

  for (const destino of destinos) {
    test(`leva do Dashboard à tela de ${destino.link}`, async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: /Dashboard/ })).toBeVisible()

      await page.getByRole('link', { name: destino.link }).click()

      await expect(page).toHaveURL(destino.url)
      await expect(page.getByRole('heading', { name: destino.titulo, level: 2 })).toBeVisible()
    })
  }
})
