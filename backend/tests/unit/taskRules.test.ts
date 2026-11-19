import { describe, it, expect } from 'vitest'
import { canTransition, type Status } from '../../src/utils/taskRules'

// RN01: PENDING -> IN_PROGRESS | CANCELLED; IN_PROGRESS -> COMPLETED | CANCELLED;
// COMPLETED e CANCELLED são finais; manter o mesmo status retorna false.
describe('canTransition', () => {
  describe('a partir de PENDING', () => {
    it.each<{ to: Status; esperado: boolean }>([
      { to: 'IN_PROGRESS', esperado: true },
      { to: 'COMPLETED', esperado: false },
      { to: 'PENDING', esperado: false }, // mesmo status
    ])('PENDING -> $to retorna $esperado', ({ to, esperado }) => {
      expect(canTransition('PENDING', to)).toBe(esperado)
    })

    // DEFEITO (RN01): a especificação permite cancelar uma tarefa pendente antes de
    // iniciá-la, mas a implementação retorna false. O teste segue a especificação.
    it.fails('permite cancelar uma tarefa pendente (PENDING -> CANCELLED)', () => {
      expect(canTransition('PENDING', 'CANCELLED')).toBe(true)
    })
  })

  describe('a partir de IN_PROGRESS', () => {
    it.each<{ to: Status; esperado: boolean }>([
      { to: 'COMPLETED', esperado: true },
      { to: 'CANCELLED', esperado: true },
      { to: 'PENDING', esperado: false }, // voltar atrás
      { to: 'IN_PROGRESS', esperado: false }, // mesmo status
    ])('IN_PROGRESS -> $to retorna $esperado', ({ to, esperado }) => {
      expect(canTransition('IN_PROGRESS', to)).toBe(esperado)
    })
  })

  describe('status finais', () => {
    const todos: Status[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

    it.each(todos)('impede a transição de COMPLETED para %s', (to) => {
      expect(canTransition('COMPLETED', to)).toBe(false)
    })

    it.each(todos)('impede a transição de CANCELLED para %s', (to) => {
      expect(canTransition('CANCELLED', to)).toBe(false)
    })
  })
})
