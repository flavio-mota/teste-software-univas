import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import type { TaskStatus } from '@prisma/client'
import request from 'supertest'
import app from '../../src/app'
import { prisma, resetDb, seedUserAndCategory } from './helpers/db'

beforeEach(resetDb)
afterAll(async () => { await prisma.$disconnect() })

// Oráculo explícito da RN01: as 16 combinações, incluindo estados finais e repetição.
const permitidas: [TaskStatus, TaskStatus][] = [
  ['PENDING', 'IN_PROGRESS'], ['PENDING', 'CANCELLED'],
  ['IN_PROGRESS', 'COMPLETED'], ['IN_PROGRESS', 'CANCELLED'],
]
const proibidas: [TaskStatus, TaskStatus][] = [
  ['PENDING', 'PENDING'], ['PENDING', 'COMPLETED'],
  ['IN_PROGRESS', 'PENDING'], ['IN_PROGRESS', 'IN_PROGRESS'],
  ['COMPLETED', 'PENDING'], ['COMPLETED', 'IN_PROGRESS'],
  ['COMPLETED', 'COMPLETED'], ['COMPLETED', 'CANCELLED'],
  ['CANCELLED', 'PENDING'], ['CANCELLED', 'IN_PROGRESS'],
  ['CANCELLED', 'COMPLETED'], ['CANCELLED', 'CANCELLED'],
]

async function criarTarefa(status: TaskStatus) {
  const { user, category } = await seedUserAndCategory()
  return prisma.task.create({ data: { title: 'Atividade', status, userId: user.id, categoryId: category.id } })
}

describe('Atualização de tarefas — API05 / RN01 / RN04', () => {
  it.each(permitidas)('permite %s para %s e persiste o novo status', async (de, para) => {
    const tarefa = await criarTarefa(de)
    const res = await request(app).put(`/api/tasks/${tarefa.id}`).send({ status: para })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toBe(tarefa.id)
    expect(res.body.data.status).toBe(para)
    const gravada = await prisma.task.findUniqueOrThrow({ where: { id: tarefa.id } })
    expect(gravada).toEqual({ ...tarefa, status: para, updatedAt: gravada.updatedAt })
    expect(await prisma.task.count()).toBe(1)
  })

  // D04: API aceita as 12 transições proibidas pela RN01.
  it.fails.each(proibidas)('recusa %s para %s sem alterar a tarefa', async (de, para) => {
    const tarefa = await criarTarefa(de)
    const res = await request(app).put(`/api/tasks/${tarefa.id}`).send({ status: para })
    expect.soft(res.status).toBe(400)
    expect.soft(res.body.success).toBe(false)
    expect.soft(typeof res.body.error).toBe('string')
    expect(await prisma.task.findUnique({ where: { id: tarefa.id } })).toEqual(tarefa)
  })

  // D05: aplicação responde 500 em vez de 404.
  it.fails('responde 404 para tarefa inexistente e preserva outra tarefa', async () => {
    const tarefa = await criarTarefa('PENDING')
    const res = await request(app).put('/api/tasks/inexistente').send({ status: 'IN_PROGRESS' })
    expect.soft(res.status).toBe(404)
    expect.soft(res.body.success).toBe(false)
    expect.soft(typeof res.body.error).toBe('string')
    expect(await prisma.task.findMany()).toEqual([tarefa])
  })
})
