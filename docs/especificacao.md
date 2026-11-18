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

## RF04 - Abertura do formulario de usuario

Fonte: Aula11 - Testes Unitarios - Frontend, slides 9 e 10.
Com a API retornando uma lista vazia, clicar em "Adicionar Usuário" deve
exibir os campos Nome e Email e o botão "Criar". Os testes localizam os
campos pelos rótulos, conforme a orientação de consultas acessíveis da aula.
Este é o único requisito de frontend selecionado para esta atividade.
