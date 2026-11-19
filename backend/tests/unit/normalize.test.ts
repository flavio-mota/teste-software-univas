import { describe, it, expect } from 'vitest'
import { normalizeName } from '../../src/utils/normalize'

// RN03: trim -> sequências de espaço em branco viram um único espaço -> minúsculas.
describe('normalizeName', () => {
  it.each([
    { descricao: 'remove espaços no início e no fim', entrada: '  Ana  ', esperado: 'ana' },
    { descricao: 'remove tabulação e quebra de linha nas pontas', entrada: '\t\nAna\n\t', esperado: 'ana' },
    { descricao: 'converte para minúsculas', entrada: 'ANA MARIA', esperado: 'ana maria' },
    { descricao: 'mantém um único espaço interno', entrada: 'Ana Maria', esperado: 'ana maria' },
    { descricao: 'reduz vários espaços internos a um', entrada: 'Ana     Maria', esperado: 'ana maria' },
    { descricao: 'reduz dois espaços internos a um (limite)', entrada: 'Ana  Maria', esperado: 'ana maria' },
    { descricao: 'troca tabulação interna por um espaço', entrada: 'Ana\tMaria', esperado: 'ana maria' },
    { descricao: 'troca quebra de linha interna por um espaço', entrada: 'Ana\nMaria', esperado: 'ana maria' },
    { descricao: 'reduz mistura de espaço, tab e quebra a um espaço', entrada: 'Ana \t\n Maria', esperado: 'ana maria' },
    { descricao: 'aplica as três etapas (exemplo da especificação)', entrada: '  Trabalho   da  Faculdade ', esperado: 'trabalho da faculdade' },
    { descricao: 'retorna vazio para string vazia', entrada: '', esperado: '' },
    { descricao: 'retorna vazio para string só com espaços em branco', entrada: ' \t\n ', esperado: '' },
  ])('$descricao', ({ entrada, esperado }) => {
    // Act
    const resultado = normalizeName(entrada)

    // Assert
    expect(resultado).toBe(esperado)
  })

  it('considera duplicados dois nomes que diferem só em caixa e espaços', () => {
    // Arrange
    const a = 'Trabalho   da Faculdade'
    const b = '  trabalho da\tFACULDADE '

    // Act + Assert
    expect(normalizeName(a)).toBe(normalizeName(b))
  })

  it('considera diferentes nomes com palavras distintas', () => {
    expect(normalizeName('Trabalho')).not.toBe(normalizeName('Estudo'))
  })
})
