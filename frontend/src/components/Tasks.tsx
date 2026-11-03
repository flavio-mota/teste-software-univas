import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

interface Task {
  id: string
  title: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  updatedAt: string
  user: User
  category: Category
}

interface User {
  id: string
  name: string
  email: string
}

interface Category {
  id: string
  name: string
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING' as Task['status'],
    priority: 'MEDIUM' as Task['priority'],
    userId: '',
    categoryId: ''
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksRes, usersRes, categoriesRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users'),
        api.get('/categories')
      ])
      
      setTasks(tasksRes.data.data)
      setUsers(usersRes.data.data)
      setCategories(categoriesRes.data.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar dados')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, formData)
      } else {
        await api.post('/tasks', formData)
      }
      resetForm()
      fetchData()
    } catch (err) {
      setError('Erro ao salvar tarefa')
      console.error('Error saving task:', err)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      userId: task.user.id,
      categoryId: task.category.id
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await api.delete(`/tasks/${id}`)
        fetchData()
      } catch (err) {
        setError('Erro ao excluir tarefa')
        console.error('Error deleting task:', err)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      userId: '',
      categoryId: ''
    })
    setEditingTask(null)
    setShowForm(false)
  }

  const getStatusClass = (status: string) => {
    return `status-badge status-${status.toLowerCase().replace('_', '-')}`
  }

  const getPriorityClass = (priority: string) => {
    return `priority-badge priority-${priority.toLowerCase()}`
  }

  if (loading) {
    return <div className="loading">Carregando tarefas...</div>
  }

  return (
    <div>
      <div className="card">
        <h2>Tarefas</h2>
        {error && <div className="error">{error}</div>}
        
        <button 
          className="btn" 
          onClick={() => setShowForm(true)}
        >
          Adicionar Tarefa
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Descrição:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
              >
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em Progresso</option>
                <option value="COMPLETED">Concluída</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prioridade:</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
            <div className="form-group">
              <label>Usuário:</label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
              >
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Categoria:</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="btn btn-success">
                {editingTask ? 'Atualizar' : 'Criar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Usuário</th>
              <th>Categoria</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>
                  <span className={getStatusClass(task.status)}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={getPriorityClass(task.priority)}>
                    {task.priority}
                  </span>
                </td>
                <td>{task.user.name}</td>
                <td>{task.category.name}</td>
                <td>{new Date(task.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => handleEdit(task)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(task.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tasks
