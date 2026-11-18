# Relatorio de testes unitarios

## Etapa 1 - Tabela de casos

### RN01 - canTransition

| # | Estado atual | Estado destino | Esperado | Tecnica |
|---|---|---|---|---|
| 1 | PENDING | IN_PROGRESS | true | Valor-limite da transicao valida |
| 2 | IN_PROGRESS | COMPLETED | true | Caminho feliz |
| 3 | IN_PROGRESS | CANCELLED | true | Caminho feliz |
| 4 | COMPLETED | PENDING, IN_PROGRESS, COMPLETED, CANCELLED | false | Estado terminal |
| 5 | CANCELLED | PENDING, IN_PROGRESS, COMPLETED, CANCELLED | false | Estado terminal |
| 6 | PENDING | COMPLETED | false | Transicao invalida |
| 7 | PENDING | CANCELLED | false | Transicao invalida |
| 8 | IN_PROGRESS | PENDING | false | Transicao invalida |
| 9 | PENDING | PENDING | false | Transicao invalida / mesmo estado |
| 10 | IN_PROGRESS | IN_PROGRESS | false | Transicao invalida / mesmo estado |

### RN03 - normalizeName

| # | Entrada | Esperado | Tecnica |
|---|---|---|---|
| 1 | `  Ana  ` | `ana` | Valor-limite / remoacao de bordas |
| 2 | `Ana    Silva` | `ana silva` | Particao / espacos consecutivos |
| 3 | `  Trabalho\t da\nFaculdade  ` | `trabalho da faculdade` | Particao / diversos espacos em branco |
| 4 | `CARLOS EDUARDO` | `carlos eduardo` | Caminho feliz / minusculo |
| 5 | `   \t\n  ` | vazio | Entrada invalida / somente espacos |
| 6 | `ana silva` | `ana silva` | Caminho feliz / ja normalizado |

## Prompt enviado ao agente

```text
Contexto: funcoes canTransition em backend/src/utils/taskRules.ts e normalizeName em
backend/src/utils/normalize.ts, regras RN01 e RN03 de docs/especificacao.md.
Use a implementacao apenas para conhecer a assinatura das funcoes.

Tarefa: escreva testes unitarios em backend/tests/unit/taskRules.test.ts e
backend/tests/unit/normalize.test.ts.

Casos obrigatorios: use exatamente a tabela de casos desta entrega.

Restricoes: siga AGENTS.md. Nao altere src/. Nao desative testes nem ajuste oraculos
para passar.

Saida: execute npm test e liste os casos cobertos por cada teste.
```

## Revisao pelo checklist

- [x] Cada caso da tabela tem teste correspondente.
- [x] Os oraculos foram obtidos da especificacao.
- [x] As assercoes usam valores exatos.
- [x] Foram incluidos caminho feliz, valores-limite e casos invalidos.
- [x] Os nomes dos testes descrevem o comportamento esperado.
- [x] Executado em Node.js 26.12.1.
- [x] Confirmado pelo `git diff src/`: nao houve alteracoes em `src/`.
- [x] Stryker executado com sucesso.

## Problemas encontrados na revisao

- Nenhum problema de implementacao identificado durante a revisao manual.
- O repositorio nao continha `docs/especificacao.md`, testes para RN01/RN03 ou `AGENTS.md`;
  a base necessaria foi criada nesta entrega.

## Avaliacao com teste de mutacao

Comando: `npm run test:mutation`

| Unidade | Mutantes mortos | Mutantes total | Score | Mutantes sobreviventes |
|---|---:|---:|---:|---:|
| taskRules.ts | 31 | 37 | 83.78% | 6 |
| normalize.ts | 6 | 6 | 100.00% | 0 |
| Total | 37 | 43 | 86.05% | 6 |

Os seis sobreviventes estao em `taskRules.ts`, dentro da guarda de estados terminal.
Eles alteram uma parte da condicao logica ou trocam um literal de status por `""`,
mas continuam produzindo o mesmo resultado para todas as transicoes permitidas pelo
tipo `Status` definido no projeto. Por isso, os sobreviventes sao mutantes equivalentes;
nenhum novo caso da especificacao foi capaz de diferenciar o mutante do codigo original.
Todos os mutantes sobreviventes foram mantidos como equivalentes no relatorio.
