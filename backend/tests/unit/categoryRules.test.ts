import { describe, it, expect } from 'vitest'
import { canDeleteCategory } from '../../src/utils/categoryRules'

// RN02: categoria só pode ser excluída quando tasksCount === 0.
describe('canDeleteCategory', () => {
  it.each([
    { tasksCount: 0, esperado: true, tecnica: 'valor-limite' },
    { tasksCount: 1, esperado: false, tecnica: 'valor-limite' },
    { tasksCount: 10, esperado: false, tecnica: 'partição' },
  ])(
    'com $tasksCount tarefa(s) retorna $esperado ($tecnica)',
    ({ tasksCount, esperado }) => {
      // Arrange: tasksCount vindo da tabela

      // Act
      const resultado = canDeleteCategory(tasksCount)

      // Assert
      expect(resultado).toBe(esperado)
    },
  )
})
