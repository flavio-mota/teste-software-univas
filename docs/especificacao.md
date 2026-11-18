# Especificacao das regras de negocio

## RN01 - Transicao de status de tarefa

Uma tarefa pode mudar de status somente nas transicoes abaixo:

- `PENDING` -> `IN_PROGRESS`: permitida.
- `IN_PROGRESS` -> `COMPLETED`: permitida.
- `IN_PROGRESS` -> `CANCELLED`: permitida.
- Qualquer transicao a partir de `COMPLETED` ou `CANCELLED`: proibida.
- Todas as outras transicoes: proibidas.

## RN03 - Normalizacao de nomes

A funcao `normalizeName` deve:

1. Remover espacos no inicio e no fim.
2. Substituir uma ou mais ocorrencias consecutivas de espaco em branco por um unico espaco.
3. Converter o nome inteiro para letras minusculas.
