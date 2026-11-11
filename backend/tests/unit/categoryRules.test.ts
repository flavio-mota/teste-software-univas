import { describe, it, expect } from 'vitest'
import { canDeleteCategory } from '../../src/utils/categoryRules'

// Exemplo de referência (escrito à mão) para a aula de testes unitários.
// Regra de negócio: uma categoria só pode ser excluída se não tiver tarefas.
describe('canDeleteCategory', () => {
  it('permite excluir uma categoria sem tarefas', () => {
    // Arrange
    const quantidadeDeTarefas = 0

    // Act
    const resultado = canDeleteCategory(quantidadeDeTarefas)

    // Assert
    expect(resultado).toBe(true)
  })

  it('impede excluir uma categoria com uma tarefa (valor-limite)', () => {
    expect(canDeleteCategory(1)).toBe(false)
  })

  it('impede excluir uma categoria com várias tarefas', () => {
    expect(canDeleteCategory(10)).toBe(false)
  })
})
