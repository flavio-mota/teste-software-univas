# Relatório de testes unitários

## Aula 11 - Testes do frontend

Para esta atividade, o requisito escolhido foi o RF04: abrir o formulário
quando clicar em **Adicionar Usuário**. A etapa 4, de sabotagens, não foi feita.
A tabela e os testes foram preparados com auxílio de IA.

### 1. Casos de teste

O resultado esperado foi retirado dos slides 9 e 10 da aula: ao abrir o
formulário, devem aparecer os campos Nome e Email e o botão Criar.
Nos três casos, a API foi simulada retornando uma lista vazia de usuários.

| Caso | Ação | Resultado esperado |
|---|---|---|
| F01 | Clicar em Adicionar Usuário | Aparecer o botão Criar |
| F02 | Clicar em Adicionar Usuário | Aparecer o campo Nome, vazio e identificado pelo rótulo |
| F03 | Clicar em Adicionar Usuário | Aparecer o campo Email, vazio e identificado pelo rótulo |

### 2. Testes

Os testes estão em `frontend/tests/unit/Users.form.test.tsx`.
Foi usado Vitest com Testing Library. O clique foi simulado com `userEvent`
e a chamada da API com `vi.spyOn`, sem precisar ligar o backend.
Como o projeto ainda não tinha a configuração de testes do frontend,
foi necessário instalar as bibliotecas e adicionar essa configuração.

Para executar, dentro da pasta `frontend`:

```powershell
npm.cmd test
```

Na primeira execução, o teste do botão passou e os dois testes dos campos
falharam. O problema foi na associação dos rótulos aos campos.

### 3. Revisão e problema encontrado

No componente `Users.tsx`, os textos Nome e Email aparecem ao lado dos
campos, mas os `label` não estão ligados aos `input`. Por isso, a busca
com `getByLabelText` não consegue encontrar os campos pelos rótulos.
O formulário abre, mas essa associação está faltando.

O problema ficou registrado como **D-F01**. Os dois testes foram mantidos
com `it.fails`, seguindo o `AGENTS.md`. Isso indica uma falha já conhecida;
não significa que o problema foi corrigido.

Na revisão, foram conferidos os casos da tabela, os nomes dos testes em
português e a separação entre preparação, ação e verificação (AAA).
Os testes usam consultas por papel ou rótulo, sem seletores CSS ou `.skip`.
Nenhum arquivo de `src/` foi alterado.

**Resultado final:** 1 teste passou e 2 ficaram como falhas esperadas.
Os três verificam partes do mesmo requisito, RF04.

---

## Atividade anterior - Backend

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

---

## Atividade de testes de integração - 25/11/2026

Aluno: Sergio Rodrigues Borges. Ferramenta: Codex.
Referências: apresentação `1.pdf`, slides 7-21, e `docs/especificacao.md`.
Esta seção complementa os registros anteriores, cujos resultados são históricos.

### Escopo e autoria

Backend: API03/RN02, API04/RN03 e API05/RN01/RN04. Frontend: RF08 e RF09.
Incluído também API02 no backend para avaliar a sabotagem que remove as tarefas
da listagem; o teste de referência API01 do professor foi reutilizado.
Os casos abaixo foram preparados com assistência de IA a partir da especificação.
Não se afirma que a etapa "especificar sem IA" tenha sido realizada pelo aluno:
essa etapa da apresentação ainda exige sua revisão e elaboração independente.

### Tabela de casos e efeitos

| ID | Regra | Estado inicial | Requisição/ação | Resposta esperada | Efeito no banco |
|---|---|---|---|---|---|
| C01 | API03 | Categoria vazia e outra categoria | DELETE da primeira | 200, success true e data pelo contrato geral | Primeira removida; outra intacta |
| C02 | API03/RN02 | Categoria com 1 tarefa | DELETE da categoria | 400, success false e error | Categoria e tarefa intactas |
| C03 | API03/RN02 | Categoria com 2 tarefas | DELETE da categoria | 400, success false e error | Categoria e tarefas intactas |
| C04 | API03 | Outra categoria existente | DELETE de id inexistente | 404, success false e error | Nenhuma alteração |
| C05 | API04 | Banco vazio | POST Estudo/Atividade | 201, success true e data | Uma categoria com nome e descrição enviados |
| C06 | API04 | Nome trabalho cadastrado | POST trabalho | 409, success false e error | Nenhuma duplicação nem alteração |
| C07 | API04/RN03 | Nome com espaços nas bordas: ` trabalho ` | POST Trabalho | 409, success false e error | Categoria original preservada |
| C08 | API04/RN03 | Trabalho da Faculdade cadastrado | POST com maiúsculas, bordas, tabulação e quebra de linha | 409, success false e error | Categoria original preservada |
| T01-T16 | API05/RN01/RN04 | Uma tarefa no estado de origem; usuário e categoria válidos | PUT com status da matriz abaixo | 200 nas permitidas, 400 nas demais | Novo status persistido ou registro integralmente preservado |
| T17 | API05 | Outra tarefa existente | PUT de id inexistente | 404, success false e error | Outra tarefa intacta |
| U01 | API02 | Dois usuários com datas fixas; antigo com 1 tarefa, novo sem tarefas | GET /api/users | 200, success true, count 2, ordem decrescente e arrays tasks | Nenhuma alteração |
| F01 | RF08/API01/API02 | MSW retorna lista vazia | Preencher Nome/Email e clicar Criar | POST com corpo exato, 201, formulário fechado e novo GET | Não se aplica: MSW simula API; nova linha aparece com email e 0 tarefas |
| F02 | RF09/API01 | MSW retorna usuário com email já cadastrado | Tentar criar com esse email | 409; mensagem Email já cadastrado; formulário e valores mantidos | Não se aplica: lista simulada permanece com um usuário |

Matriz explícita das 16 transições (colunas = destino; linhas = origem).
Cada célula corresponde a um caso independente, com resetDb antes da execução.

| Origem / destino | PENDING | IN_PROGRESS | COMPLETED | CANCELLED |
|---|---|---|---|---|
| PENDING | 400 | 200 | 400 | 200 |
| IN_PROGRESS | 400 | 400 | 200 | 200 |
| COMPLETED | 400 | 400 | 400 | 400 |
| CANCELLED | 400 | 400 | 400 | 400 |

### Contexto e prompts de trabalho

Registro dos critérios usados na geração assistida, e não transcrição de um
prompt independente escrito pelo aluno.

Backend:

```text
Implemente a tabela C01-C08 e T01-T17 contra API03, API04 e API05 de
docs/especificacao.md. Use Supertest request(app), Prisma real e os helpers
resetDb/seedUserAndCategory. Confira status, corpo e persistência, incluindo
registros que devem permanecer intactos. Não use mocks do Prisma nem altere
helpers, especificação ou produção. Cubra as 16 transições explícitas da RN01.
Adicione U01/API02 para detectar a retirada de tasks da listagem.
Execute os testes; documente divergências e marque somente falhas comprovadas
com it.fails, mantendo o oráculo original.
```

Frontend:

```text
Implemente F01/RF08 e F02/RF09 com Testing Library, user-event e MSW.
Não use vi.spyOn(api). Responda GET com success/count/data e POST com o
contrato API01. Capture request.json() e confira exatamente nome e email.
No sucesso, confira fechamento do formulário, novo GET e linha atualizada.
No 409, confira a mensagem exigida e a preservação dos campos e da lista.
Execute e registre os defeitos sem alterar src/ ou os valores esperados.
```

### Revisão e ajustes

- Casos isolados por resetDb; Prisma desconectado após cada arquivo.
- Mantidos os helpers e a URL original `teste_software_test_db`, protegida pelo
  sufixo `_test_db`; nenhum teste usa o banco da aplicação.
- HTTP atravessa Express/Prisma no backend e Axios/MSW no frontend.
- Verificados status, corpo, gravação/remoção e preservação de outros registros.
- Nomes em português; estrutura Arrange/Act/Assert; matrizes com it.each.
- Nenhum teste desativado com skip, only ou todo. Falhas esperadas identificadas
  por comentários D01-D06 e it.fails, após execução inicial que comprovou o defeito.
- Ajustada a espera da mensagem do frontend para findByText: uma asserção soft
  dentro de waitFor não oferece a espera desejada. O texto esperado foi mantido.
- Incluído U01 para garantir cobertura da sabotagem de API02; o frontend com MSW
  sozinho não detectaria uma mudança real no controller do backend.
- Dependências instaladas pelo lockfile, sem alterar manifestos, com autorização
  do aluno. Cliente Prisma gerado e banco exclusivo de teste inicializado.
- Na suíte geral, os dois casos antigos de Nome/Email em Users.form.test.tsx
  passaram inesperadamente: o upstream já corrigiu D-F01. Removida apenas a
  marcação it.fails desses casos, mantendo as mesmas asserções.

### Defeitos confirmados

| ID | Regra / casos | Esperado | Observado | Tratamento |
|---|---|---|---|---|
| D01 | Contrato geral/API03, C01 | Sucesso com success e data | DELETE retorna success e message, sem data; remoção funciona | 1 it.fails; esclarecer com professor se DELETE deve ser exceção ao contrato geral |
| D02 | API03, C04 | 404 sem alterações | 500; categoria alheia preservada | 1 it.fails |
| D03 | API04/RN03, C07-C08 | 409 sem duplicação | 201 e novas categorias equivalentes pela normalização | 2 casos it.fails |
| D04 | API05/RN01/RN04, 12 transições proibidas | 400 e tarefa intacta | 200, transição aceita, inclusive estados finais e repetição | 12 casos it.fails |
| D05 | API05, T17 | 404 sem alterações | 500; outra tarefa preservada | 1 it.fails |
| D06 | RF09, F02 | Email já cadastrado | Erro ao salvar usuário; campos preservados | 1 it.fails |

As asserções mantêm o comportamento da especificação. `it.fails` significa
defeito conhecido, não comportamento correto; ao corrigir o defeito, o teste
passará inesperadamente e exigirá a retirada da marcação após revisão.
Como qualquer it.fails aceita uma falha no corpo do teste, é necessário revisar
a causa nas próximas execuções para não confundir regressões com o defeito original.

### Resultados de execução

- Backend, primeira execução efetiva: 27 casos, 10 aprovados e 17 reprovados.
  U01 foi acrescentado depois para a avaliação de sabotagem.
- Backend final: 28 casos, 11 sem falha e 17 falhas esperadas documentadas.
- Frontend integração: 3 casos (inclui referência do professor), 2 sem falha e
  1 falha esperada documentada.
- Foram adicionados 26 casos de backend e 2 de frontend. Os 3 casos de referência
  do professor foram preservados.
- Comandos: `npm run test:integration` em backend e frontend. No Windows foi
  usado `npm.cmd` para evitar a política de scripts do PowerShell.
- Regressão: backend unitário com 18 aprovados; frontend completo com 6 casos
  aprovados normalmente e 1 falha esperada (D06).
- O teste unitário histórico que proíbe PENDING -> CANCELLED contradiz a RN01
  atual, embora passe contra a implementação da função. Foi preservado como
  histórico da atividade anterior; a nova integração usa a matriz atual do professor.

### Avaliação por sabotagem controlada

Autorizada pelo aluno como exceção temporária à proibição de editar src/.
Cada alteração foi aplicada sozinha, testada e restaurada byte a byte em bloco
finally, antes da próxima. As falhas abaixo são adicionais às falhas esperadas.

| Sabotagem | Arquivo | Teste que reprovou | Resultado |
|---|---|---|---|
| Desabilitar guarda canDeleteCategory | backend/src/controllers/categoryController.ts | C02 e C03: categoria com 1 e 2 tarefas | Detectada: 2 falhas |
| Trocar status 409 por 400 | backend/src/controllers/userController.ts | Referência API01: email repetido | Detectada: 1 falha |
| Remover include de tasks em getUsers | backend/src/controllers/userController.ts | U01: listagem com tarefas | Detectada: 1 falha |
| Remover fetchUsers após salvar | frontend/src/components/Users.tsx | F01: usuário aparece após criação | Detectada: 1 falha |

Resultado: 4 de 4 sabotagens detectadas. Isso não equivale a cobertura total
nem a score automático do Stryker. Nenhuma sabotagem permanece no código entregue.

### Compatibilidade com o repositório do professor

Trabalho isolado na branch `atividade-integracao`, criada sobre a main sincronizada.
Arquivos novos usam o sufixo `atividade` para reduzir colisões com exemplos futuros.
Testes novos, esta seção e a retirada de duas marcações antigas de falha esperada
compõem a entrega; especificação,
AGENTS.md, dependências, configuração e código de produção foram preservados.
Isso evita sobrescrever o material atual; não é uma garantia contra conflitos
futuros caso ambos editem o mesmo trecho do relatório.

---

## Aula 13 - Testes E2E - 25/11/2026

Aluno: Sergio Rodrigues Borges. Ferramenta: Codex.
Referências: `Aula13 - Testes E2E.pdf`, slides 8-20, e jornadas/RNF01 de
`docs/especificacao.md`. Entrega na branch `atividade-e2e`, baseada na atividade
de integração e contendo todas as atualizações atuais de upstream/main.

### Plano e tabela de casos

Os dez casos novos cobrem J03-J06 obrigatórias e J07-J08 complementares.
J01 (3 destinos) e J02 (cadastro) reutilizam os arquivos de referência sem alteração.
A tabela foi produzida com assistência de IA; não representa a etapa
"especificar sem IA" realizada pelo aluno. A revisão independente dessa etapa
permanece responsabilidade do aluno antes da entrega acadêmica.

| Caso | Jornada | Preparação pela API | Passos do usuário | Resultado visível esperado | Após recarregar |
|---|---|---|---|---|---|
| E01 | J03 | Usuário com nome e email únicos | Editar; mudar Nome; Atualizar | Formulário fechado; novo nome na linha; antigo ausente | Mesmo email com novo nome; antigo ausente |
| E02 | J04 | Usuário exclusivo | Excluir na linha e confirmar diálogo | Linha removida | Usuário ausente |
| E03 | J04 alternativa | Usuário exclusivo | Excluir na linha e cancelar diálogo | Linha preservada | Usuário presente |
| E04 | J05 cadastro | Nome único reservado; registro para limpeza do que for criado na UI | Adicionar Categoria; preencher Nome/Descrição; Criar | Formulário fechado; categoria com descrição | Categoria e descrição persistidas |
| E05 | J05 edição | Categoria exclusiva com descrição | Editar; mudar Nome/Descrição; Atualizar | Novo nome e descrição; nome antigo ausente | Mesmos dados atualizados |
| E06 | J05 exclusão | Categoria exclusiva sem tarefas | Excluir e confirmar | Categoria removida | Categoria ausente |
| E07 | J05 alternativa | Categoria exclusiva sem tarefas | Excluir e cancelar | Categoria preservada | Categoria presente |
| E08 | J06 | Usuário, categoria e tarefa exclusivos, relacionados | Excluir categoria e confirmar | Mensagem de erro; categoria mantida | Categoria presente; tarefa conferida também na tela Tarefas |
| E09 | J07 complementar | Usuário com email exclusivo cadastrado | Tentar criar outro usuário com o mesmo email | Email já cadastrado; campos mantidos | Uma única linha com usuário original |
| E10 | J08 complementar | Usuário, categoria e tarefa COMPLETED exclusivos | Editar tarefa; selecionar Pendente; Atualizar | Alteração recusada | Status COMPLETED mantido |

### Contextualização e geração

Critérios usados para orientar a geração assistida (não é transcrição de prompt
independente escrito pelo aluno):

```text
Use a tabela E01-E10 e docs/especificacao.md como oráculo. Importe test/expect
de ./support/fixtures e prepare dados com a fixture dados, unico e emailUnico.
Crie os testes em arquivos novos *.atividade.e2e.spec.ts. Use getByRole,
getByLabel, linhas filtradas pelos dados únicos e page.once('dialog') antes
do clique. Cubra confirmar e cancelar exclusões. Confira persistência com
page.reload(). Registre categorias criadas na UI para limpeza mesmo se uma
asserção falhar. Não use mocks, seletores CSS/XPath, esperas fixas, force,
retries extras ou alterações na configuração. Execute antes de marcar
test.fail(), registre defeitos e não mude as asserções para fazê-los passar.
Repita cada caso cinco vezes; aplique sabotagens individualmente e restaure
os arquivos de produção antes de continuar.
```

Os agentes opcionais do Playwright não foram instalados; foi utilizado o fluxo
por prompt permitido pela apresentação. A inspeção do resultado incluiu o
relatório, contextos de erro e captura do formulário de categorias.

### Ambiente e revisão

- Aplicação completa em Docker: frontend :3000, backend :3001 e PostgreSQL.
- Playwright local com Chromium da versão instalada no lockfile.
- Banco da aplicação existente, sem reset e sem reexecutar seed; dados do seed
  não são pré-condições dos testes e não são alterados.
- Mantidos workers 1, retries 0, timeout original, configuração, fixtures e
  especificação do professor. Sem alteração permanente em src/.
- Localizadores sem CSS/XPath; controles por papel/rótulo; linhas por dado único.
- Dialog handler registrado antes da exclusão; verificação de que houve diálogo
  impede que o cenário de cancelamento passe se a confirmação for removida.
- E04 aguarda a resposta do POST antes de registrar o dado para limpeza;
  um finally repete o registro por nome se a jornada falhar depois da gravação.
- Não se verifica quantidade global de registros nem se depende de outro teste.
- Esperas por asserções do Playwright; nenhuma espera fixa dentro dos testes.
- `test.fail()` adicionado somente após a primeira execução comprovar o defeito.
  Uma falha esperada não valida as etapas posteriores que não foram alcançadas.

### Defeitos e limites de cobertura

| ID | Casos | Especificado | Observado | Registro |
|---|---|---|---|---|
| E2E-D01 | E04/E05, J05/RNF01 | Campos associados a Nome e Descrição | Rótulos visíveis sem associação; getByLabel('Nome:') não encontra o campo | test.fail; cadastro/edição bloqueados antes de salvar |
| E2E-D02 | E10, J08/RNF01 | Status localizável pelo rótulo | Select sem associação ao rótulo Status | test.fail; não foi possível alcançar a tentativa de transição pela UI |
| E2E-D03 | E09, J07/RF09 | Email já cadastrado | Erro ao salvar usuário | test.fail; campos mantidos e registro original conferido após recarregar |

E2E-D01/E2E-D02 não foram contornados com seletores estruturais. Os scripts
contêm a jornada completa, mas a persistência de cadastro/edição de categorias
e a recusa de transição de J08 não foram validadas até o fim nesta versão.
A ausência de validação de transições já observada na integração é evidência
da atividade anterior, não um resultado obtido pelo E2E bloqueado.

### Execução e estabilidade

Execução inicial sem marcações: 14 casos, 10 aprovados e 4 reprovados.
As quatro falhas correspondem a E04, E05, E09 e E10 e foram preservadas como
falhas esperadas por `test.fail(true, descrição do defeito)`.

Estabilidade com `--repeat-each=5`: 70 execuções em aproximadamente 2,9 minutos,
sem falhas inesperadas ou intermitentes. São 50 aprovações normais (10 casos x 5)
e 20 falhas esperadas reproduzidas (4 casos x 5). O resumo do Playwright informa
"70 passed" porque inclui resultados esperados; isso não significa que os
quatro defeitos foram corrigidos ou que todas as jornadas chegaram ao fim.

Comandos (pasta frontend):

```text
npm run test:e2e
npx playwright test --repeat-each=5
npm run test:e2e:report
```

### Evidências locais

Na pasta de trabalho, fora do Git, `../e2e-evidencias/` preserva o relatório
HTML inicial, os contextos de erro, capturas, vídeos e traces das falhas.
`frontend/playwright-report/` contém o relatório mais recente e pode ser aberto
com `npm run test:e2e:report`. Os artefatos grandes continuam ignorados pelo Git.
Exemplo para analisar um trace: `npx playwright show-trace <caminho/trace.zip>`.

### Avaliação por sabotagem

As alterações temporárias foram autorizadas pelo aluno e restauradas byte a
byte em finally. A primeira tentativa revelou um problema de ambiente: o Vite
no Docker não invalidou o cache ao editar arquivos pelo Windows. As três
sabotagens de frontend não se refletiram no navegador e essa tentativa foi
descartada como avaliação dos testes. Foi necessário reiniciar o serviço após
cada aplicação/restauração; não foram mudados localizadores, expectativas,
timeouts, retries ou configuração para obter as falhas.

Cada sabotagem é avaliada apenas nas jornadas afetadas; a suíte completa é
executada novamente depois de restaurar o código. O comando mantém os
reporters list/json/html e gera capturas, vídeos e traces das falhas reais.

| Sabotagem aplicada isoladamente | Jornadas executadas | Falhas novas observadas | Resultado |
|---|---|---|---|
| Retirar fetchUsers após salvar em Users.tsx | J02 e J03 | Cadastro não atualiza lista; edição não mostra novo nome | Detectada, 2 falhas |
| Trocar o texto do link Categorias por Classificações em App.tsx | J01, três destinos | Link Categorias não localizado; Usuários/Tarefas continuam passando | Detectada, 1 falha |
| Ignorar window.confirm ao excluir usuário | J04, cancelamento | Nenhum diálogo; usuário é excluído apesar da intenção de cancelar | Detectada, 1 falha |
| Desabilitar canDeleteCategory no backend | J06 | Erro não exibido, categoria e tarefa removidas | Detectada, 1 falha |

As três sabotagens de frontend exigidas na atividade foram detectadas. Também
foi avaliada a sabotagem de backend apresentada no slide 18: total 4/4 detectadas,
sem usar Stryker. Isso não significa cobertura de todas as falhas possíveis.

Depois da restauração, a comparação completa das respostas da API confirmou
preservação dos registros preexistentes: 2 usuários, 3 categorias e 5 tarefas.
Não restaram usuários de teste com domínio @teste.com. O seed não foi alterado
nem reexecutado. Os snapshots e os resumos JSON estão em `../e2e-evidencias/`.

### Entrega e compatibilidade

Três arquivos novos em `frontend/tests/e2e/` e esta seção do relatório.
Nenhuma alteração nos exemplos J01/J02, fixtures, configuração, src/,
AGENTS.md, especificação ou manifestos de dependências. A branch mantém os
commits anteriores do aluno e a base atual do professor; a main não é sobrescrita.
As falhas esperadas precisam ser revisitadas quando os defeitos forem corrigidos:
um teste que passar inesperadamente fará a suíte reprovar, indicando revisão
da marcação test.fail().

Verificação final após restaurar as sabotagens: 14 resultados esperados em
34,2 segundos (10 aprovações normais e 4 falhas conhecidas), zero falhas
inesperadas. O diff confirmou que nenhum arquivo de produção ou configuração
foi alterado na entrega.
