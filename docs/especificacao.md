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
