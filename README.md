# 📋 Task Manager - Projeto Base para Teste de Software

Este é um projeto base desenvolvido para a disciplina de **Teste de Software**, contendo uma aplicação completa com API REST e interface web, pronta para que os alunos implementem diferentes tipos de testes.

## 🎯 Objetivos de Aprendizado

Este projeto foi estruturado para que os alunos pratiquem:

- **Testes Unitários**: Implementar testes para funções e componentes isolados
- **Testes de Integração**: Desenvolver testes para comunicação entre diferentes partes do sistema
- **Testes de Interface (E2E)**: Criar testes para fluxos completos através da interface do usuário

## 🏗️ Arquitetura do Projeto

```
/
├── docker-compose.yml          # Configuração dos containers
├── env.example                 # Variáveis de ambiente de exemplo
├── backend/                    # API REST (Node.js + TypeScript)
│   ├── src/
│   │   ├── controllers/        # Controladores da API
│   │   ├── routes/            # Rotas da API
│   │   ├── middleware/        # Middleware de tratamento de erros
│   │   └── index.ts           # Ponto de entrada da aplicação
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco de dados
│   │   └── seed.ts           # Dados iniciais para o banco
│   ├── tests/
│   │   ├── unit/             # Testes unitários
│   │   ├── integration/      # Testes de integração
│   │   └── setup.ts          # Configuração dos testes
│   └── package.json
├── frontend/                   # Interface Web (React + TypeScript)
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── services/          # Serviços de API
│   │   └── App.tsx           # Componente principal
│   ├── tests/
│   │   └── e2e/              # Testes E2E com Selenium
│   └── package.json
└── README.md
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 26+ (opcional, para desenvolvimento local)

### 1. Clone e Configure

```bash
# Clone o repositório
git clone https://github.com/flavio-mota/teste-software-univas.git
cd teste-software-univas

# Copie o arquivo de variáveis de ambiente
cp env.example .env
```

### 2. Execute com Docker

```bash
# Inicie todos os serviços
docker compose up -d

# Verifique se os serviços estão rodando
docker compose ps
```

### 3. Acesse a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **PostgreSQL**: localhost:5432

### 4. Configure o Banco de Dados

```bash
# Execute as migrações e seed
docker compose exec backend npm run db:push
docker compose exec backend npm run db:seed
```

### 5. Para parar a aplicação

```bash
# Encerra a aplicação e remove os containers
docker compose down
```

## 🧪 Implementando os Testes

### Estrutura para Testes
```
backend/
├── tests/
│   ├── unit/           # Testes unitários (para implementar)
│   ├── integration/    # Testes de integração (para implementar)
│   └── README.md       # Guia de exercícios
frontend/
├── tests/
│   └── e2e/           # Testes E2E (para implementar)
│       └── README.md   # Guia de exercícios
```


## 📊 Entidades do Sistema

### User (Usuário)
- `id`: Identificador único
- `name`: Nome do usuário
- `email`: Email único
- `createdAt`: Data de criação
- `tasks`: Lista de tarefas do usuário

### Category (Categoria)
- `id`: Identificador único
- `name`: Nome da categoria
- `description`: Descrição opcional
- `createdAt`: Data de criação
- `tasks`: Lista de tarefas da categoria

### Task (Tarefa)
- `id`: Identificador único
- `title`: Título da tarefa
- `description`: Descrição opcional
- `status`: Status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority`: Prioridade (LOW, MEDIUM, HIGH, URGENT)
- `userId`: ID do usuário responsável
- `categoryId`: ID da categoria
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 🔗 API Endpoints

### Usuários
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `GET /api/tasks/:id` - Buscar tarefa por ID
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Excluir tarefa

### Categorias
- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/:id` - Buscar categoria por ID
- `POST /api/categories` - Criar nova categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Excluir categoria

## 📚 Exercícios

### Nível Básico

1. **Exploração do Sistema**
   - Navegue pela interface e crie alguns usuários, categorias e tarefas
   - Teste todas as funcionalidades CRUD
   - Observe como os dados se relacionam entre si
<!-- 
2. **Implementar Testes Unitários Básicos**
   - Crie testes para validação de dados de entrada
   - Implemente testes para funções de transformação
   - Adicione testes para casos de erro simples

3. **Implementar Testes de Integração Básicos**
   - Teste endpoints GET da API
   - Implemente testes para criação de registros
   - Adicione testes para relacionamentos básicos

### Nível Intermediário

4. **Expandir Testes Unitários**
   - Implemente testes para lógica de negócio complexa
   - Adicione testes para diferentes cenários de validação
   - Crie testes para funções de cálculo e estatísticas

5. **Expandir Testes de Integração**
   - Teste cenários de erro da API
   - Implemente testes para operações CRUD completas
   - Adicione testes para filtros e consultas

6. **Implementar Testes E2E**
   - Crie testes para navegação entre páginas
   - Implemente testes para fluxos completos de usuário
   - Adicione testes para validação de formulários

### Nível Avançado

7. **Testes de Performance**
   - Implemente testes de carga para a API
   - Adicione testes de performance para o frontend
   - Crie testes de stress para o banco de dados

8. **Testes de Segurança**
   - Implemente testes para validação de entrada
   - Adicione testes para prevenção de SQL injection
   - Crie testes para autenticação e autorização

9. **Melhorar Cobertura**
   - Aumente a cobertura de código
   - Implemente testes de mutação
   - Adicione testes de acessibilidade -->

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js 26**: Runtime JavaScript
- **TypeScript**: Linguagem tipada
- **Express**: Framework web
- **Prisma**: ORM para banco de dados
- **PostgreSQL**: Banco de dados relacional
- **Vitest**: Framework de testes
- **Zod**: Validação de dados

### Frontend
- **React 18**: Biblioteca para interface
- **TypeScript**: Linguagem tipada
- **Vite**: Build tool e dev server
- **React Router**: Roteamento
- **Axios**: Cliente HTTP
- **Selenium WebDriver**: Testes E2E

### DevOps
- **Docker**: Containerização
- **Docker Compose**: Orquestração de containers

## 🔧 Desenvolvimento Local

Se preferir desenvolver sem Docker:

### Backend
```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Banco de Dados
```bash
# Instale PostgreSQL localmente e configure conforme .env
```

## 📝 Logs e Debugging

```bash
# Ver logs de todos os serviços
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Acessar container para debugging
docker compose exec backend bash
docker compose exec frontend bash
```

<!-- ## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request -->

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique se todos os serviços estão rodando: `docker-compose ps`
2. Consulte os logs: `docker-compose logs`
3. Verifique se as portas não estão em uso
4. Reinicie os serviços: `docker-compose restart`

---

**Desenvolvido para a disciplina de Teste de Software - UNIVAS** 🎓
