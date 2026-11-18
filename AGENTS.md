# Regras obrigatorias

1. Nao altere nenhum arquivo dentro de `src/`.
2. A especificacao em `docs/especificacao.md` e o oraculo dos testes.
3. Nunca desative um teste com `.skip` nem altere o valor esperado para fazer o teste passar.
4. Use Vitest, a estrutura AAA e assercoes exatas (`toBe`, `toEqual`).
5. Nomeie os testes em portugues e descreva o comportamento esperado.
6. Se um teste baseado na especificacao falhar, registre o defeito no relatorio e marque o teste com `it.fails`.
7. Backend: execute `npm test` a partir da pasta `backend`.

# Convencoes dos testes

- Agrupe os testes com `describe`.
- Use `it` em portugues.
- Use apenas dependencias locais, sem rede, banco ou mock desnecessario.
