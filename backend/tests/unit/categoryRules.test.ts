import { describe, it, expect } from 'vitest'
import { canDeleteCategory } from '../../src/utils/categoryRules'

describe('canDeleteCategory', () => {
  it('permite excluir categoria sem tarefas — tasksCount 0 (valor-limite)', () => {
    // Arrange
    const tasksCount = 0

    // Act
    const result = canDeleteCategory(tasksCount)

    // Assert
    expect(result).toBe(true)
  })

  it('impede excluir categoria com uma tarefa — tasksCount 1 (valor-limite)', () => {
    // Arrange
    const tasksCount = 1

    // Act
    const result = canDeleteCategory(tasksCount)

    // Assert
    expect(result).toBe(false)
  })

  it('impede excluir categoria com dez tarefas — tasksCount 10 (partição)', () => {
    // Arrange
    const tasksCount = 10

    // Act
    const result = canDeleteCategory(tasksCount)

    // Assert
    expect(result).toBe(false)
  })
})
