import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app'
import { prisma, resetDb } from './helpers/db'

// Exemplo de referência (escrito à mão) para a aula de testes de integração.
// Contrato API01 (docs/especificacao.md): POST /api/users.
// O teste atravessa rota → validação (Zod) → controller → Prisma → PostgreSQL.
describe('POST /api/users (API01)', () => {
  beforeEach(async () => {
    await resetDb()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('cria um usuário válido, responde 201 e grava no banco', async () => {
    // Act
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Ana Souza', email: 'ana@email.com' })

    // Assert: resposta HTTP no formato do contrato
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject({ name: 'Ana Souza', email: 'ana@email.com' })

    // Assert: efeito colateral no banco de dados
    const noBanco = await prisma.user.findUnique({ where: { email: 'ana@email.com' } })
    expect(noBanco?.name).toBe('Ana Souza')
  })

  it('responde 409 ao repetir um email já cadastrado', async () => {
    // Arrange
    await prisma.user.create({ data: { name: 'Ana Souza', email: 'ana@email.com' } })

    // Act
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Outra Ana', email: 'ana@email.com' })

    // Assert
    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
    expect(await prisma.user.count()).toBe(1)
  })
})
