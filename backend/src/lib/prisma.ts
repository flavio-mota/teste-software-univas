import { PrismaClient } from '@prisma/client'

// Instância única do Prisma Client, isolada em um módulo próprio.
// Nos testes unitários, este módulo é substituído por um mock (vi.mock),
// sem abrir conexão com o banco e sem iniciar o servidor HTTP.
export const prisma = new PrismaClient()
