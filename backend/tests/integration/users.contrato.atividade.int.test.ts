import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app'
import { prisma, resetDb, seedUserAndCategory } from './helpers/db'

beforeEach(resetDb)
afterAll(async () => { await prisma.$disconnect() })

describe('Listagem de usuários — API02 (avaliação por sabotagem)', () => {
  it('lista usuários do mais recente ao mais antigo com suas tarefas', async () => {
    // Arrange: datas fixas, sem depender do relógio nem da ordem de criação.
    const { user, category } = await seedUserAndCategory()
    await prisma.user.update({ where: { id: user.id }, data: { createdAt: new Date('2026-01-01T00:00:00Z') } })
    const novo = await prisma.user.create({ data: { name: 'Bia', email: 'bia@example.com', createdAt: new Date('2026-02-01T00:00:00Z') } })
    const tarefa = await prisma.task.create({ data: { title: 'Estudar', userId: user.id, categoryId: category.id } })
    const antes = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    // Act
    const res = await request(app).get('/api/users')
    // Assert
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.count).toBe(2)
    expect(res.body.data.map((item: { id: string }) => item.id)).toEqual([novo.id, user.id])
    expect(res.body.data[0].tasks).toEqual([])
    expect(res.body.data[1].tasks.map((item: { id: string }) => item.id)).toEqual([tarefa.id])
    expect(await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })).toEqual(antes)
    expect(await prisma.task.findMany()).toEqual([tarefa])
  })
})
