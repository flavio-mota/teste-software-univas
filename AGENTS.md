# AGENTS.md — instruções para agentes de IA (Claude Code, Codex, GitHub Copilot)

Projeto didático da disciplina de Teste de Software (UNIVÁS). O objetivo do aluno é
**escrever e executar testes**; o código de produção é o objeto de estudo.

## Comandos

Backend (executar dentro de `backend/`):
- `npm install` — instala dependências (uma vez)
- `npm test` — executa todos os testes uma vez
- `npm run test:coverage` — testes + relatório de cobertura
- `npm run test:mutation` — teste de mutação (Stryker) sobre `src/utils`

Frontend (executar dentro de `frontend/`):
- `npm install`
- `npm test`
- `npm run test:coverage`

Testes unitários não precisam de Docker nem de banco de dados.

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
- Local: `backend/tests/unit/<arquivo>.test.ts` e `frontend/tests/unit/<Componente>.test.tsx`.
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

## Ao terminar

Execute os testes e apresente ao aluno: (a) a lista de testes criados, cada um ligado à
regra da especificação que verifica; (b) quais falharam e por quê; (c) qualquer divergência
encontrada entre especificação e código.
