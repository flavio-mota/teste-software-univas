import { describe, expect, it } from 'vitest'
import { canTransition, type Status } from '../../src/utils/taskRules'

describe('canTransition', () => {
  it('permite PENDING -> IN_PROGRESS', () => {
    expect(canTransition('PENDING', 'IN_PROGRESS')).toBe(true)
  })

  it('permite IN_PROGRESS -> COMPLETED', () => {
    expect(canTransition('IN_PROGRESS', 'COMPLETED')).toBe(true)
  })

  it('permite IN_PROGRESS -> CANCELLED', () => {
    expect(canTransition('IN_PROGRESS', 'CANCELLED')).toBe(true)
  })

  it('impede qualquer transicao a partir de COMPLETED', () => {
    const destinos: Status[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

    for (const destino of destinos) {
      expect(canTransition('COMPLETED', destino)).toBe(false)
    }
  })

  it('impede qualquer transicao a partir de CANCELLED', () => {
    const destinos: Status[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

    for (const destino of destinos) {
      expect(canTransition('CANCELLED', destino)).toBe(false)
    }
  })

  it('impede PENDING -> COMPLETED', () => {
    expect(canTransition('PENDING', 'COMPLETED')).toBe(false)
  })

  it('impede PENDING -> CANCELLED', () => {
    expect(canTransition('PENDING', 'CANCELLED')).toBe(false)
  })

  it('impede IN_PROGRESS -> PENDING', () => {
    expect(canTransition('IN_PROGRESS', 'PENDING')).toBe(false)
  })

  it('impede transicoes que mantem o mesmo status', () => {
    expect(canTransition('PENDING', 'PENDING')).toBe(false)
    expect(canTransition('IN_PROGRESS', 'IN_PROGRESS')).toBe(false)
  })
})
