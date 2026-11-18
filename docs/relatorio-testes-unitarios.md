# Relatorio de testes unitarios

## Aula 11 - Frontend: somente RF04

Atividade realizada em 18/11/2026. Foi escolhido apenas RF04, abertura do
formulário de Users. A etapa 4 (sabotagens) foi excluída por solicitação do aluno.
As seções de backend abaixo são registros anteriores, preservados nesta entrega.

### Etapa 1 - Casos de teste

Fonte dos resultados esperados: slides 9 e 10 do PDF da Aula 11, registrados
em `docs/especificacao.md`. A especificação local anterior só continha regras
de backend. A tabela abaixo foi preparada com auxílio de IA; não constitui
uma etapa realizada pelo aluno sem IA, como propõe o enunciado original.

| Caso | Requisito | Preparação | Ação | Resultado esperado |
|---|---|---|---|---|
| F01 | RF04 | `api.get` resolve `{ data: { data: [] } }` | Clicar em Adicionar Usuário | Botão Criar aparece |
| F02 | RF04 | Mesma resposta vazia | Clicar em Adicionar Usuário | Campo Nome acessível pelo rótulo, inicialmente vazio |
| F03 | RF04 | Mesma resposta vazia | Clicar em Adicionar Usuário | Campo Email acessível pelo rótulo, inicialmente vazio |

### Etapa 2 - Geração e execução

Prompt reproduzível:

```text
Contexto: Users.tsx e RF04 em docs/especificacao.md, conforme a Aula 11.
Gere apenas os casos F01, F02 e F03 da tabela acima em
frontend/tests/unit/Users.form.test.tsx. Siga AGENTS.md, use AAA,
userEvent, getByRole/getByLabelText e mock de api.get. Não altere src/.
Execute os testes. Registre defeitos e mantenha os testes com it.fails
se a falha decorrer da produção. Não realize a etapa 4 de sabotagens.
```

Foi necessário instalar as bibliotecas de teste e criar `vitest.config.ts`,
`tests/setup.ts` e os scripts de teste em `package.json`, pois a configuração
descrita na aula não estava presente neste checkout. Essas mudanças de
infraestrutura e o lockfile acompanham os testes; nenhuma altera src/.

Comando, a partir de `frontend`: `npm.cmd test`.

Primeira execução: 3 testes, 1 aprovado (F01) e 2 falhas (F02 e F03).
As duas falhas apontaram rótulos sem controles associados. Após confirmar a
causa, F02 e F03 foram marcados com `it.fails`, conforme AGENTS.md, regra 6.
Essa marcação mantém os testes executando e não representa correção do defeito.

Execução final: Vitest 5.1.1, 1 arquivo aprovado, **1 teste aprovado e
2 falhas esperadas**, total de 3 testes; código de saída 0.

### Etapa 3 - Revisão

- [x] Apenas RF04 foi selecionado; cada caso tem um teste correspondente.
- [x] Casos e resultados esperados documentados na especificação.
- [x] Nomes em português, estrutura AAA e asserções exatas com `toBe`.
- [x] Interações com userEvent e consultas por papel/rótulo.
- [x] API simulada; nenhum backend, banco ou Docker necessário.
- [x] Limpeza do DOM e restauração dos mocks entre testes.
- [x] Sem seletores CSS, snapshots, data-testid, `.skip` ou esperas fixas.
- [x] Código de produção preservado; defeito registrado abaixo.
- [x] Etapa 4 não realizada.

### Defeito D-F01 - Rótulos sem associação aos campos

Local: `frontend/src/components/Users.tsx`, formulário de criação.
Os elementos `label` Nome e Email são irmãos dos inputs, mas não têm
`htmlFor` associado a um `id`, nem envolvem os inputs. Por isso,
`getByLabelText('Nome:')` e `getByLabelText('Email:')` lançam
`Found a label ... however no form control was found associated to that label`.

Impacto: os campos aparecem visualmente, mas não são identificáveis pelos
rótulos através das consultas acessíveis exigidas pela aula. F01 confirma
que o clique abre o formulário; F02 e F03 preservam a expectativa acessível.
Não foi aplicado contorno com seleção por posição ou CSS. Uma correção futura
deve associar os rótulos aos campos em uma alteração de produção separada e
remover `it.fails` após validar os testes. Nenhuma correção foi feita nesta atividade.

---

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
