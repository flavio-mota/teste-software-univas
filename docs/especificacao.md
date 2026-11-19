# Especificação de comportamento — Task Manager

Este documento é a **fonte da verdade** para os testes. O resultado esperado de cada
teste deve ser derivado das regras abaixo, e **nunca** da leitura do código-fonte.
Quando o código e a especificação divergirem, o teste deve falhar: isso é um defeito
encontrado, não um teste errado.

## Backend — regras de negócio (`backend/src/utils`)

### RN01 — Transição de status de tarefa (`canTransition(from, to)`)

Os status possíveis são `PENDING`, `IN_PROGRESS`, `COMPLETED` e `CANCELLED`.

| De            | Para permitido                  |
|---------------|---------------------------------|
| `PENDING`     | `IN_PROGRESS`, `CANCELLED`      |
| `IN_PROGRESS` | `COMPLETED`, `CANCELLED`        |
| `COMPLETED`   | nenhum (status final)           |
| `CANCELLED`   | nenhum (status final)           |

- Qualquer transição não listada na tabela é proibida e retorna `false`.
- Manter o mesmo status (ex.: `PENDING` → `PENDING`) não é uma transição e retorna `false`.
- Uma tarefa pendente pode ser cancelada antes de ser iniciada.

### RN02 — Exclusão de categoria (`canDeleteCategory(tasksCount)`)

- Uma categoria só pode ser excluída quando não possui nenhuma tarefa associada
  (`tasksCount === 0`).
- Com uma ou mais tarefas associadas, a exclusão é proibida.

### RN03 — Normalização de nomes (`normalizeName(name)`)

O nome normalizado é obtido aplicando, nesta ordem:

1. remoção dos espaços em branco no início e no fim;
2. substituição de qualquer sequência de espaços em branco internos (espaço, tabulação,
   quebra de linha) por um único espaço;
3. conversão para letras minúsculas.

Exemplo: `"  Trabalho   da  Faculdade "` → `"trabalho da faculdade"`.

Dois nomes de categoria que resultem no mesmo nome normalizado são considerados duplicados.

### RN04 — Atualização de status de tarefa (`PUT /api/tasks/:id`)

Uma alteração de status só é aceita se respeitar a RN01. Caso contrário, a API deve
responder `400` sem alterar a tarefa.

## API — contrato HTTP (`backend/src/controllers`)

Formato das respostas: sucesso `{ "success": true, "data": ... }` (listas incluem `count`);
erro `{ "success": false, "error": "<mensagem>" }`.

### API01 — `POST /api/users`

- Dados válidos (`name` não vazio e `email` em formato válido): `201`, com o usuário criado em
  `data` (`id`, `name`, `email`), e o usuário passa a existir no banco.
- `name` vazio ou `email` inválido: `400`, e nenhum usuário é criado.
- `email` já cadastrado: `409`, e nenhum usuário é criado.

### API02 — `GET /api/users`

- `200`, com `count` e `data` contendo todos os usuários, do mais recente para o mais
  antigo; cada usuário traz a lista `tasks` (vazia quando não houver tarefas).

### API03 — `DELETE /api/categories/:id` (aplica a RN02)

- Categoria sem tarefas: `200`, e a categoria deixa de existir no banco.
- Categoria com uma ou mais tarefas: `400`, e a categoria e suas tarefas permanecem no banco.
- Categoria inexistente: `404`.

### API04 — `POST /api/categories` (aplica a RN03)

- Nome inédito: `201`.
- Nome que, após a normalização da RN03, coincide com o de uma categoria existente
  (ex.: `"Trabalho"` quando já existe `" trabalho "`): `409`, e nenhuma categoria é criada.

### API05 — `PUT /api/tasks/:id` (aplica a RN01 e a RN04)

- Alteração de status permitida pela RN01: `200`, e o novo status é gravado.
- Alteração de status proibida pela RN01 (ex.: `COMPLETED` → `PENDING`): `400`, e a tarefa
  permanece inalterada no banco.
- Tarefa inexistente: `404`.

## Frontend — componente `Users` (`frontend/src/components/Users.tsx`)

- **RF01** — Enquanto a lista é carregada, o texto "Carregando usuários..." é exibido.
- **RF02** — Após o carregamento, cada usuário aparece em uma linha da tabela com nome,
  email e quantidade de tarefas (0 quando não houver tarefas).
- **RF03** — Se a API falhar ao listar usuários, a mensagem "Erro ao carregar usuários"
  é exibida.
- **RF04** — Ao clicar em "Adicionar Usuário", é exibido um formulário com os campos
  **Nome** e **Email** e o botão **Criar**.
- **RF05** — Ao clicar em "Cancelar", o formulário é fechado e os campos são limpos.
- **RF06** — Ao clicar em "Editar" em uma linha, o formulário é aberto já preenchido com
  os dados daquele usuário e o botão passa a se chamar **Atualizar**.
- **RF07 (acessibilidade)** — Todo campo de formulário deve estar associado ao seu rótulo,
  de modo que possa ser localizado pelo texto do rótulo (tecnologias assistivas e
  `getByLabelText`).
- **RF08** — Ao preencher Nome e Email e clicar em "Criar", os dados digitados são enviados
  à API (`POST /api/users`); em caso de sucesso, o formulário é fechado e a lista, recarregada,
  passa a exibir o novo usuário.
- **RF09** — Se a API responder `409` ao criar um usuário, a mensagem "Email já cadastrado" é
  exibida e o formulário permanece aberto com os dados digitados.
