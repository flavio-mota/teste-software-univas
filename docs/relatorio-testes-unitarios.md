# Relatório — Testes unitários com IA generativa

**Aluno(s):** Matheus Reginato Rezende
**Ferramenta de IA utilizada:** Claude Code
**Unidade testada:** `backend/src/utils/taskRules.ts` — RN01 (`canTransition`) e `backend/src/utils/normalize.ts` — RN03 (`normalizeName`)

## 1. Tabela de casos (elaborada antes de usar a IA)

Os valores esperados vêm de `docs/especificacao.md`, não da implementação.

### RN01 — `canTransition(from, to)`

| # | Entrada (from → to) | Resultado esperado | Técnica | Regra |
|---|---------------------|--------------------|---------|-------|
| 1 | PENDING → IN_PROGRESS | true | partição (transição permitida) | RN01 |
| 2 | PENDING → CANCELLED | true | partição (cancelar antes de iniciar) | RN01 |
| 3 | PENDING → COMPLETED | false | inválido (pula etapa) | RN01 |
| 4 | PENDING → PENDING | false | inválido (mesmo status) | RN01 |
| 5 | IN_PROGRESS → COMPLETED | true | partição | RN01 |
| 6 | IN_PROGRESS → CANCELLED | true | partição | RN01 |
| 7 | IN_PROGRESS → PENDING | false | inválido (volta atrás) | RN01 |
| 8 | IN_PROGRESS → IN_PROGRESS | false | inválido (mesmo status) | RN01 |
| 9–12 | COMPLETED → cada um dos 4 status | false | inválido (status final) | RN01 |
| 13–16 | CANCELLED → cada um dos 4 status | false | inválido (status final) | RN01 |

### RN03 — `normalizeName(name)`

| # | Entrada | Resultado esperado | Técnica | Regra |
|---|---------|--------------------|---------|-------|
| 1 | `"  Ana  "` | `"ana"` | partição (trim) | RN03.1 |
| 2 | `"\t\nAna\n\t"` | `"ana"` | partição (trim de tab/quebra de linha) | RN03.1 |
| 3 | `"ANA MARIA"` | `"ana maria"` | partição (minúsculas) | RN03.3 |
| 4 | `"Ana Maria"` | `"ana maria"` | valor-limite (1 espaço, nada a colapsar) | RN03.2 |
| 5 | `"Ana  Maria"` | `"ana maria"` | valor-limite (2 espaços) | RN03.2 |
| 6 | `"Ana     Maria"` | `"ana maria"` | partição (vários espaços) | RN03.2 |
| 7 | `"Ana\tMaria"` | `"ana maria"` | partição (tabulação) | RN03.2 |
| 8 | `"Ana\nMaria"` | `"ana maria"` | partição (quebra de linha) | RN03.2 |
| 9 | `"Ana \t\n Maria"` | `"ana maria"` | partição (mistura de espaços em branco) | RN03.2 |
| 10 | `"  Trabalho   da  Faculdade "` | `"trabalho da faculdade"` | exemplo da especificação | RN03 |
| 11 | `""` | `""` | valor-limite (vazio) | RN03 |
| 12 | `" \t\n "` | `""` | valor-limite (só espaços em branco) | RN03 |
| 13 | `"Trabalho   da Faculdade"` vs `"  trabalho da\tFACULDADE "` | mesmo resultado | duplicidade | RN03 |
| 14 | `"Trabalho"` vs `"Estudo"` | resultados diferentes | duplicidade (negativo) | RN03 |

## 2. Prompt utilizado

```
Contexto: funções canTransition (backend/src/utils/taskRules.ts, regra RN01) e
normalizeName (backend/src/utils/normalize.ts, regra RN03) de docs/especificacao.md.
Use a implementação apenas para conhecer a assinatura das funções.

Tarefa: escreva testes unitários em backend/tests/unit/taskRules.test.ts e
backend/tests/unit/normalize.test.ts.

Casos obrigatóriosvalidei: as tabelas da seção 1 deste relatório.

Restrições: siga o AGENTS.md. Não altere src/. Se um teste que segue a
especificação falhar, não o ajuste: marque com it.fails e um comentário com a regra violada.

Saída: execute npm test e liste cada teste com o caso da tabela que ele verifica.
```

## 3. Revisão do teste gerado

| Problema encontrado no teste gerado | Ajuste solicitado ou realizado |
|-------------------------------------|--------------------------------|
| O agente leu a implementação de `canTransition` e `normalizeName` ao inspecionar os arquivos (risco de teste-espelho). | Valores esperados conferidos contra `docs/especificacao.md`; nenhum foi copiado do código. Foi isso que expôs o defeito de `PENDING → CANCELLED`. |
| O caso `PENDING → CANCELLED` (falha pela especificação) não pode ficar dentro do `it.each`, pois `it.fails` se aplicaria à tabela inteira. | Caso isolado em um `it.fails` próprio, com comentário da regra violada (RN01); valor esperado mantido (`true`), sem ajuste para passar. |
| Os nomes dos testes de tabela (`... retorna true/false`) descrevem o resultado, não o comportamento esperado em português como pede o `AGENTS.md`. | Não ajustado: os nomes de `taskRules.test.ts` seguem a tabela da especificação e estão rastreáveis a cada caso. Candidato a reescrita se o professor exigir. |
| Os 6 mutantes sobreviventes em `taskRules.ts:5` poderiam sugerir testes faltando. | Analisados: guard redundante (mutantes equivalentes), nenhum caso novo necessário. |

## 4. Resultados

- Testes criados: 33 (RN01: 15 + 1 `it.fails`; RN03: 14; RN02 já existente: 3 — total do projeto) | aprovados: 32 | reprovados: 0 (1 falha esperada, `it.fails`)
- Cobertura de linhas da unidade: 100 % (`src/utils`: 6/6 linhas, 13/13 branches)
- Score de mutação (backend): 87,23 % total — `categoryRules.ts` 100 %, `normalize.ts` 100 %, `taskRules.ts` 83,78 % (31 mortos, 6 sobreviventes)

**Mutantes sobreviventes (6, todos em `taskRules.ts:5`):** o guard
`if (from === 'COMPLETED' || from === 'CANCELLED') return false` é redundante: sem ele, as
linhas seguintes já retornam `false` para esses status. Remover ou alterar o guard não muda
nenhum resultado observável, logo são **mutantes equivalentes** e nenhum caso novo os mata.

## 5. Defeitos encontrados (divergências entre especificação e código)

| Regra | Comportamento especificado | Comportamento observado | Teste que evidencia |
|-------|----------------------------|-------------------------|---------------------|
| RN01 | `PENDING → CANCELLED` é permitido ("uma tarefa pendente pode ser cancelada antes de ser iniciada") | `canTransition('PENDING', 'CANCELLED')` retorna `false` | `taskRules.test.ts` › `it.fails('permite cancelar uma tarefa pendente (PENDING -> CANCELLED)')` |
