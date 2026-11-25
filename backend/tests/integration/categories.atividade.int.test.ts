import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app'
import { prisma, resetDb, seedUserAndCategory } from './helpers/db'

beforeEach(resetDb)
afterAll(async () => { await prisma.$disconnect() })

function verificarErro(body: { success: boolean; error: string }) {
  expect(body.success).toBe(false)
  expect(typeof body.error).toBe('string')
  expect(body.error.length).toBeGreaterThan(0)
}

describe('Exclusão de categorias — API03 / RN02', () => {
  // D01: resposta de sucesso omite data, exigido pelo contrato geral.
  it.fails('remove categoria sem tarefas e preserva outra categoria', async () => {
    // Arrange
    const alvo = await prisma.category.create({ data: { name: 'alvo' } })
    const outra = await prisma.category.create({ data: { name: 'outra' } })
    // Act
    const res = await request(app).delete(`/api/categories/${alvo.id}`)
    // Assert: contrato geral e efeito independente do corpo
    expect.soft(res.status).toBe(200)
    expect.soft(res.body.success).toBe(true)
    expect.soft(res.body).toHaveProperty('data')
    expect(await prisma.category.findUnique({ where: { id: alvo.id } })).toBe(null)
    expect(await prisma.category.findMany()).toEqual([outra])
  })

  it.each([1, 2])('recusa excluir categoria com %i tarefa(s), sem alterar registros', async (quantidade) => {
    // Arrange
    const { user, category } = await seedUserAndCategory()
    for (let i = 0; i < quantidade; i++) {
      await prisma.task.create({ data: { title: `Tarefa ${i}`, userId: user.id, categoryId: category.id } })
    }
    const tarefas = await prisma.task.findMany({ orderBy: { id: 'asc' } })
    // Act
    const res = await request(app).delete(`/api/categories/${category.id}`)
    // Assert
    expect.soft(res.status).toBe(400)
    expect(await prisma.category.findUnique({ where: { id: category.id } })).toEqual(category)
    expect(await prisma.task.findMany({ orderBy: { id: 'asc' } })).toEqual(tarefas)
    verificarErro(res.body)
  })

  // D02: aplicação responde 500 em vez de 404.
  it.fails('responde 404 para categoria inexistente sem remover dados', async () => {
    const outra = await prisma.category.create({ data: { name: 'outra' } })
    const res = await request(app).delete('/api/categories/inexistente')
    expect.soft(res.status).toBe(404)
    expect(await prisma.category.findMany()).toEqual([outra])
    verificarErro(res.body)
  })
})

describe('Cadastro de categorias — API04 / RN03', () => {
  it('responde 201 e persiste nome inédito', async () => {
    const res = await request(app).post('/api/categories').send({ name: 'Estudo', description: 'Atividade' })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.name).toBe('Estudo')
    expect(res.body.data.description).toBe('Atividade')
    expect(await prisma.category.count()).toBe(1)
    const gravada = await prisma.category.findUnique({ where: { id: res.body.data.id } })
    expect(gravada?.name).toBe('Estudo')
    expect(gravada?.description).toBe('Atividade')
  })

  async function verificarDuplicidade(existente: string, nome: string) {
    const categoria = await prisma.category.create({ data: { name: existente } })
    const res = await request(app).post('/api/categories').send({ name: nome })
    expect.soft(res.status).toBe(409)
    expect.soft(await prisma.category.findMany()).toEqual([categoria])
    verificarErro(res.body)
  }

  it('recusa nome exatamente repetido', async () => {
    await verificarDuplicidade('trabalho', 'trabalho')
  })

  // D03: nomes equivalentes pela RN03 são gravados como categorias distintas.
  it.fails.each([
    [' trabalho ', 'Trabalho'],
    ['Trabalho da Faculdade', '  TRABALHO\t da\nFaculdade  '],
  ])('recusa nome equivalente a %s ao cadastrar %s', verificarDuplicidade)
})
