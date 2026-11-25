import { describe, expect, it } from 'vitest'
import { normalizeName } from '../../src/utils/normalize'

describe('normalizeName', () => {
  it('remove espacos antes e depois do nome', () => {
    expect(normalizeName('  Ana  ')).toBe('ana')
  })

  it('substitui espacos consecutivos por um unico espaco', () => {
    expect(normalizeName('Ana    Silva')).toBe('ana silva')
  })

  it('normaliza tabulacoes e quebras de linha como espaco', () => {
    expect(normalizeName('  Trabalho\t da\nFaculdade  ')).toBe('trabalho da faculdade')
  })

  it('converte o nome inteiro para letras minusculas', () => {
    expect(normalizeName('CARLOS EDUARDO')).toBe('carlos eduardo')
  })

  it('retorna string vazia para um nome composto apenas por espacos', () => {
    expect(normalizeName('   \t\n  ')).toBe('')
  })

  it('mantem um nome ja normalizado', () => {
    expect(normalizeName('ana silva')).toBe('ana silva')
  })
})
