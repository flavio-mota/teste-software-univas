import { describe, it, expect } from 'vitest'
import { canTransition } from '../../src/utils/taskRules'
import { normalizeName } from '../../src/utils/normalize'

describe('canTransition (RN01)', () => {
  it.each([
    ['RN01-01', 'PENDING', 'IN_PROGRESS', true],
    ['RN01-03', 'IN_PROGRESS', 'COMPLETED', true],
    ['RN01-04', 'IN_PROGRESS', 'CANCELLED', true],
    ['RN01-05', 'PENDING', 'COMPLETED', false],
    ['RN01-06', 'IN_PROGRESS', 'PENDING', false],
    ['RN01-07', 'COMPLETED', 'PENDING', false],
    ['RN01-08', 'COMPLETED', 'IN_PROGRESS', false],
    ['RN01-09', 'COMPLETED', 'CANCELLED', false],
    ['RN01-10', 'CANCELLED', 'PENDING', false],
    ['RN01-11', 'CANCELLED', 'IN_PROGRESS', false],
    ['RN01-12', 'CANCELLED', 'COMPLETED', false],
    ['RN01-13', 'PENDING', 'PENDING', false],
    ['RN01-14', 'IN_PROGRESS', 'IN_PROGRESS', false],
    ['RN01-15', 'COMPLETED', 'COMPLETED', false],
    ['RN01-16', 'CANCELLED', 'CANCELLED', false],
  ] as const)('%s: %s → %s retorna %s', (_id, from, to, expected) => {
    expect(canTransition(from, to)).toBe(expected)
  })

  it.fails('RN01-02: PENDING → CANCELLED retorna true (defeito: retorna false)', () => {
    expect(canTransition('PENDING', 'CANCELLED')).toBe(true)
  })
})

describe('normalizeName (RN03)', () => {
  it.each([
    ['RN03-01', '  Trabalho   da  Faculdade ', 'trabalho da faculdade'],
    ['RN03-02', '  Casa', 'casa'],
    ['RN03-03', 'Casa  ', 'casa'],
    ['RN03-04', 'Casa    Nova', 'casa nova'],
    ['RN03-05', 'Casa Nova', 'casa nova'],
    ['RN03-06', 'Casa\tNova', 'casa nova'],
    ['RN03-07', 'Casa\nNova', 'casa nova'],
    ['RN03-08', 'Casa \t\n Nova', 'casa nova'],
    ['RN03-09', '\t Casa \n', 'casa'],
    ['RN03-10', 'CASA', 'casa'],
    ['RN03-11', 'CaSa NoVa', 'casa nova'],
    ['RN03-12', 'casa nova', 'casa nova'],
    ['RN03-13', '', ''],
    ['RN03-14', '   ', ''],
    ['RN03-15', 'ÁGUA  Éfêmera', 'água éfêmera'],
    ['RN03-16', 'Projeto 2026', 'projeto 2026'],
  ] as const)('%s: normaliza a entrada para o esperado', (_id, input, expected) => {
    expect(normalizeName(input)).toBe(expected)
  })

  it('RN03-17: considera iguais os resultados normalizados de " Casa " e "CASA"', () => {
    expect(normalizeName(' Casa ')).toBe(normalizeName('CASA'))
  })
})
