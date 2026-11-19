import { beforeAll, afterEach, afterAll } from 'vitest'
// Adiciona ao expect() os matchers do jest-dom:
// toBeInTheDocument(), toHaveTextContent(), toBeDisabled() etc.
import '@testing-library/jest-dom/vitest'
import { server } from './msw/server'

// MSW: intercepta requisições HTTP nos testes de integração.
// onUnhandledRequest: 'error' faz o teste falhar se o componente chamar
// uma rota para a qual o teste não declarou um handler.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
