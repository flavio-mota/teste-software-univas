# Tabela de casos de teste — RN01 e RN03

Fonte da verdade: `docs/especificacao.md`. O resultado esperado de cada caso vem
somente da especificação, nunca da leitura do código-fonte.

## RN01 — `canTransition(from, to)` (`backend/src/utils/taskRules.ts`)

Status possíveis: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` (16 combinações).

| ID | De | Para | Esperado | Justificativa (especificação) |
|---|---|---|---|---|
| RN01-01 | PENDING | IN_PROGRESS | `true` | Permitido na tabela |
| RN01-02 | PENDING | CANCELLED | `true` | Cancelar antes de iniciar |
| RN01-03 | IN_PROGRESS | COMPLETED | `true` | Permitido na tabela |
| RN01-04 | IN_PROGRESS | CANCELLED | `true` | Permitido na tabela |
| RN01-05 | PENDING | COMPLETED | `false` | Não listada |
| RN01-06 | IN_PROGRESS | PENDING | `false` | Não listada (retrocesso) |
| RN01-07 | COMPLETED | PENDING | `false` | Status final |
| RN01-08 | COMPLETED | IN_PROGRESS | `false` | Status final |
| RN01-09 | COMPLETED | CANCELLED | `false` | Status final |
| RN01-10 | CANCELLED | PENDING | `false` | Status final |
| RN01-11 | CANCELLED | IN_PROGRESS | `false` | Status final |
| RN01-12 | CANCELLED | COMPLETED | `false` | Status final |
| RN01-13 | PENDING | PENDING | `false` | Mesmo status não é transição |
| RN01-14 | IN_PROGRESS | IN_PROGRESS | `false` | Mesmo status não é transição |
| RN01-15 | COMPLETED | COMPLETED | `false` | Mesmo status não é transição |
| RN01-16 | CANCELLED | CANCELLED | `false` | Mesmo status não é transição |

## RN03 — `normalizeName(name)` (`backend/src/utils/normalize.ts`)

Ordem aplicada: (1) remover espaços do início e do fim; (2) trocar qualquer sequência
de espaços internos (espaço, tabulação, quebra de linha) por um único espaço;
(3) converter para minúsculas.

| ID | Entrada | Esperado | O que verifica |
|---|---|---|---|
| RN03-01 | `"  Trabalho   da  Faculdade "` | `"trabalho da faculdade"` | Exemplo oficial da especificação |
| RN03-02 | `"  Casa"` | `"casa"` | Remoção de espaços no início |
| RN03-03 | `"Casa  "` | `"casa"` | Remoção de espaços no fim |
| RN03-04 | `"Casa    Nova"` | `"casa nova"` | Espaços internos múltiplos viram um só |
| RN03-05 | `"Casa Nova"` | `"casa nova"` | Espaço único é preservado |
| RN03-06 | `"Casa\tNova"` | `"casa nova"` | Tabulação vira espaço |
| RN03-07 | `"Casa\nNova"` | `"casa nova"` | Quebra de linha vira espaço |
| RN03-08 | `"Casa \t\n Nova"` | `"casa nova"` | Sequência mista vira um único espaço |
| RN03-09 | `"\t Casa \n"` | `"casa"` | Tabulação e quebra de linha nas pontas |
| RN03-10 | `"CASA"` | `"casa"` | Conversão para minúsculas |
| RN03-11 | `"CaSa NoVa"` | `"casa nova"` | Caixa mista |
| RN03-12 | `"casa nova"` | `"casa nova"` | Já normalizado (idempotência) |
| RN03-13 | `""` | `""` | String vazia |
| RN03-14 | `"   "` | `""` | Somente espaços |
| RN03-15 | `"ÁGUA  Éfêmera"` | `"água éfêmera"` | Maiúsculas acentuadas |
| RN03-16 | `"Projeto 2026"` | `"projeto 2026"` | Números preservados |
| RN03-17 | `normalizeName(" Casa ")` e `normalizeName("CASA")` | resultados iguais | Duplicidade: mesmo nome normalizado |

## Casos adicionados pelo Stryker

Cada mutante sobrevivente vira uma nova linha aqui (RN01-17, RN03-18, ...).

| ID | Regra | Entrada | Esperado | Mutante que originou o caso |
|---|---|---|---|---|
| | | | | |
