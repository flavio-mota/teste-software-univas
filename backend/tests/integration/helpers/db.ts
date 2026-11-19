import { prisma } from '../../../src/lib/prisma'
import { assertTestDatabase } from './testDatabase'

// Mesma instância do Prisma usada pela aplicação: o teste prepara os dados
// e a API lê exatamente o mesmo banco.
export { prisma }

// Apaga todos os registros, respeitando as chaves estrangeiras
// (tarefas dependem de usuários e categorias).
export async function resetDb() {
  assertTestDatabase(process.env.DATABASE_URL)
  await prisma.task.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
}

// Cenário mínimo usado por vários testes: um usuário e uma categoria.
export async function seedUserAndCategory() {
  const user = await prisma.user.create({
    data: { name: 'Ana Souza', email: 'ana@email.com' }
  })
  const category = await prisma.category.create({ data: { name: 'trabalho' } })
  return { user, category }
}
