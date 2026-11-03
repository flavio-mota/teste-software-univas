import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  name: string
  email: string
  createdAt: string
  tasks?: Task[]
}

interface Task {
  id: string
  title: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  user: User
  category: Category
}

interface Category {
  id: string
  name: string
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar usuários')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData)
      } else {
        await api.post('/users', formData)
      }
      setFormData({ name: '', email: '' })
      setEditingUser(null)
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      setError('Erro ao salvar usuário')
      console.error('Error saving user:', err)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`)
        fetchUsers()
      } catch (err) {
        setError('Erro ao excluir usuário')
        console.error('Error deleting user:', err)
      }
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', email: '' })
    setEditingUser(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="loading">Carregando usuários...</div>
  }

  return (
    <div>
      <div className="card">
        <h2>Usuários</h2>
        {error && <div className="error">{error}</div>}
        
        <button 
          className="btn" 
          onClick={() => setShowForm(true)}
        >
          Adicionar Usuário
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <button type="submit" className="btn btn-success">
                {editingUser ? 'Atualizar' : 'Criar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tarefas</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.tasks?.length || 0}</td>
                <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(user.id)}
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

export default Users
