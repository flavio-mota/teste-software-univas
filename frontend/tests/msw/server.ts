import { setupServer } from 'msw/node'

// Servidor de mocks HTTP usado nos testes de integração do frontend.
// Ele intercepta as requisições reais feitas pelo Axios (serviço api) e
// responde com os handlers registrados em cada teste via server.use(...).
// Começa sem handlers: toda rota usada precisa ser declarada no teste.
export const server = setupServer()
