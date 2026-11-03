import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  tasks?: Task[]
}

interface Task {
  id: string
  title: string
  user: User
}

interface User {
  id: string
  name: string
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get('/categories')
      setCategories(response.data.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar categorias')
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData)
      } else {
        await api.post('/categories', formData)
      }
      setFormData({ name: '', description: '' })
      setEditingCategory(null)
      setShowForm(false)
      fetchCategories()
    } catch (err) {
      setError('Erro ao salvar categoria')
      console.error('Error saving category:', err)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({ 
      name: category.name, 
      description: category.description || '' 
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.delete(`/categories/${id}`)
        fetchCategories()
      } catch (err) {
        setError('Erro ao excluir categoria')
        console.error('Error deleting category:', err)
      }
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', description: '' })
    setEditingCategory(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="loading">Carregando categorias...</div>
  }

  return (
    <div>
      <div className="card">
        <h2>Categorias</h2>
        {error && <div className="error">{error}</div>}
        
        <button 
          className="btn" 
          onClick={() => setShowForm(true)}
        >
          Adicionar Categoria
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
              <label>Descrição:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <button type="submit" className="btn btn-success">
                {editingCategory ? 'Atualizar' : 'Criar'}
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
              <th>Descrição</th>
              <th>Tarefas</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description || '-'}</td>
                <td>{category.tasks?.length || 0}</td>
                <td>{new Date(category.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => handleEdit(category)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(category.id)}
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

export default Categories
