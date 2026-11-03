import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Users from './components/Users'
import Tasks from './components/Tasks'
import Categories from './components/Categories'
import Dashboard from './components/Dashboard'

function App() {
  const location = useLocation()

  return (
    <div className="container">
      <header className="header">
        <h1>📋 Task Manager</h1>
        <p>Sistema de gerenciamento de tarefas para disciplina de Teste de Software</p>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/users" 
            className={location.pathname === '/users' ? 'active' : ''}
          >
            Usuários
          </Link>
          <Link 
            to="/tasks" 
            className={location.pathname === '/tasks' ? 'active' : ''}
          >
            Tarefas
          </Link>
          <Link 
            to="/categories" 
            className={location.pathname === '/categories' ? 'active' : ''}
          >
            Categorias
          </Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
