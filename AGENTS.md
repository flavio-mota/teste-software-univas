# AGENTS.md — instruções para agentes de IA (Claude Code, Codex, GitHub Copilot)

Projeto didático da disciplina de Teste de Software (UNIVÁS). O objetivo do aluno é
**escrever e executar testes**; o código de produção é o objeto de estudo.

## Comandos

Backend (executar dentro de `backend/`):
- `npm install` — instala dependências (uma vez)
- `npm test` — executa os testes unitários (`tests/unit`)
- `npm run test:coverage` — testes unitários + relatório de cobertura
- `npm run test:mutation` — teste de mutação (Stryker) sobre `src/utils`
- `npm run test:integration` — testes de integração (`tests/integration`), com banco real

Frontend (executar dentro de `frontend/`):
- `npm install`
- `npm test` — todos os testes (unitários e de integração)
- `npm run test:unit` / `npm run test:integration`
- `npm run test:coverage`
- `npm run test:e2e` — testes E2E com Playwright (`tests/e2e`); exige a aplicação completa
  em execução (`docker compose up -d`)
- `npm run test:e2e:ui` / `npm run test:e2e:report`

Testes unitários não precisam de Docker nem de banco de dados. Os testes de integração do
backend precisam do container do PostgreSQL ativo (`docker compose up -d postgres`) e usam
o banco separado `teste_software_test_db`, recriado a cada execução.

## Regras obrigatórias

1. **Não altere nenhum arquivo dentro de `src/`.** Se um teste não puder ser escrito ou
   não puder passar sem alterar o código de produção, pare e explique o motivo ao aluno.
2. **A especificação é o oráculo.** Os valores esperados vêm de `docs/especificacao.md`
   ou do que o aluno informar no prompt, nunca da leitura da implementação. Se o código
   divergir da especificação, o teste deve falhar e você deve relatar a divergência.
3. **Nunca ajuste um teste para que ele passe** (mudar o valor esperado, apagar asserções,
   usar `.skip`, `.only` ou `.todo`) sem autorização explícita do aluno.
4. Não instale, remova ou atualize dependências.

## Convenções dos testes

- Framework: **Vitest**. Importe explicitamente: `import { describe, it, expect, vi } from 'vitest'`.
- Local dos testes unitários: `backend/tests/unit/<arquivo>.test.ts` e
  `frontend/tests/unit/<Componente>.test.tsx`.
- Local dos testes de integração: `backend/tests/integration/<recurso>.int.test.ts` e
  `frontend/tests/integration/<Componente>.<fluxo>.int.test.tsx`.
- `describe` = unidade testada; `it` = comportamento esperado, escrito em português
  (ex.: `it('impede transição de COMPLETED para qualquer status')`).
- Estrutura **AAA** (Arrange, Act, Assert), com comentários nos testes mais longos.
- Um comportamento por teste. Use `it.each` para tabelas de casos.
- Asserções específicas: `toBe`, `toEqual`, `toHaveBeenCalledWith`, `toBeInTheDocument`.
  `toBeDefined()` e `toBeTruthy()` não são aceitos como única verificação de um teste.
- Inclua **valores-limite** e **casos inválidos**, não apenas o caminho feliz.
- Isolamento:
  - backend: o banco é substituído com `vi.mock('../../src/lib/prisma', () => ({ prisma: { ... } }))`;
  - frontend: as chamadas HTTP são substituídas com `vi.spyOn(api, 'get' | 'post' | ...)`;
  - sem rede, sem banco, sem `setTimeout` real e sem depender da data atual.
- Frontend: localize elementos como o usuário (`getByRole`, `getByLabelText`, `getByText`)
  e simule interações com `@testing-library/user-event`. Não use `container.querySelector`
  nem snapshots.

## Testes de integração

- Backend:
  - envie requisições HTTP com Supertest: `request(app)`, importando `app` de `src/app.ts`;
  - **não use `vi.mock` no Prisma**: o teste usa o banco de teste real;
  - prepare os dados com os helpers de `tests/integration/helpers/db.ts` (`resetDb()` no
    `beforeEach`, `prisma.$disconnect()` no `afterAll`);
  - verifique a resposta (status e corpo no formato do contrato da especificação) **e** o
    efeito no banco (registro criado, alterado ou mantido);
  - nunca altere `helpers/testDatabase.ts` nem aponte os testes para outro banco.
- Frontend:
  - simule a API com **MSW** (`server.use(http.get(...))`, servidor em `tests/msw/server.ts`);
  - **não use `vi.spyOn(api, ...)`**: a requisição HTTP real do Axios deve acontecer;
  - as respostas simuladas seguem exatamente o contrato da especificação (`{ success, data }`);
  - quando o fluxo envia dados, verifique também o corpo da requisição recebida pelo handler.

## Testes E2E (Playwright)

- Local: `frontend/tests/e2e/<Recurso>.e2e.spec.ts`. Importe `test` e `expect` de
  `./support/fixtures` (não de `@playwright/test`), para ter a fixture `dados`.
- Cada teste corresponde a uma **jornada** de `docs/especificacao.md` (J01, J02...) e a
  verifica **pela interface**, como o usuário faria.
- Dados:
  - prepare os dados que a jornada exige pela API, com `dados.criarUsuario(...)`,
    `dados.criarCategoria(...)` e `dados.criarTarefa(...)`;
  - registre para limpeza o que for criado pela interface
    (`dados.registrarUsuarioPorEmail`, `dados.registrarCategoriaPorNome`);
  - use valores únicos (`unico()`, `emailUnico()`); nunca dependa dos dados do seed, da
    quantidade de registros na tela nem de dados criados por outro teste;
  - nunca altere nem exclua dados do seed.
- Localizadores: `getByRole`, `getByLabel`, `getByText`. Não use seletores CSS/XPath, não
  use `{ force: true }` e não adicione `data-testid` em `src/`.
- Esperas: use as asserções com espera automática (`await expect(...).toBeVisible()`).
  **Nunca use `page.waitForTimeout`** nem esperas fixas.
- Diálogos de confirmação (`window.confirm`): `page.once('dialog', d => d.accept())`
  antes do clique.
- Verifique a **persistência** quando a jornada grava dados: `page.reload()` e nova asserção.
- Não aumente `timeout`, `retries` nem altere `playwright.config.ts` para fazer um teste passar.
- Agentes do Playwright (planner, generator, healer): o healer pode corrigir **localizadores
  e esperas**, mas **nunca** asserções ou valores esperados. Se a falha indicar diferença
  entre a jornada especificada e o comportamento da aplicação, relate o defeito.

## Ao terminar

Execute os testes e apresente ao aluno: (a) a lista de testes criados, cada um ligado à
regra da especificação que verifica; (b) quais falharam e por quê; (c) qualquer divergência
encontrada entre especificação e código.
