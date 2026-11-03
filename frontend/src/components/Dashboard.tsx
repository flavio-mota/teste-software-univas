import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

interface DashboardStats {
  totalUsers: number
  totalTasks: number
  totalCategories: number
  tasksByStatus: {
    PENDING: number
    IN_PROGRESS: number
    COMPLETED: number
    CANCELLED: number
  }
  tasksByPriority: {
    LOW: number
    MEDIUM: number
    HIGH: number
    URGENT: number
  }
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [usersRes, tasksRes, categoriesRes] = await Promise.all([
        api.get('/users'),
        api.get('/tasks'),
        api.get('/categories')
      ])

      const users = usersRes.data.data
      const tasks = tasksRes.data.data
      const categories = categoriesRes.data.data

      // Calculate stats
      const tasksByStatus = tasks.reduce((acc: Record<string, number>, task: { status: string }) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      }, {})

      const tasksByPriority = tasks.reduce((acc: Record<string, number>, task: { priority: string }) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      }, {})

      setStats({
        totalUsers: users.length,
        totalTasks: tasks.length,
        totalCategories: categories.length,
        tasksByStatus: {
          PENDING: tasksByStatus.PENDING || 0,
          IN_PROGRESS: tasksByStatus.IN_PROGRESS || 0,
          COMPLETED: tasksByStatus.COMPLETED || 0,
          CANCELLED: tasksByStatus.CANCELLED || 0
        },
        tasksByPriority: {
          LOW: tasksByPriority.LOW || 0,
          MEDIUM: tasksByPriority.MEDIUM || 0,
          HIGH: tasksByPriority.HIGH || 0,
          URGENT: tasksByPriority.URGENT || 0
        }
      })

      setError(null)
    } catch (err) {
      setError('Erro ao carregar estatísticas')
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return <div className="loading">Carregando dashboard...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!stats) {
    return <div className="error">Nenhum dado disponível</div>
  }

  return (
    <div>
      <div className="card">
        <h2>📊 Dashboard</h2>
        <p>Visão geral do sistema de gerenciamento de tarefas</p>

        <div className="grid grid-3" style={{ marginTop: '20px' }}>
          <div className="card">
            <h3>👥 Usuários</h3>
            <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#3498db' }}>
              {stats.totalUsers}
            </p>
          </div>
          
          <div className="card">
            <h3>📋 Tarefas</h3>
            <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#e74c3c' }}>
              {stats.totalTasks}
            </p>
          </div>
          
          <div className="card">
            <h3>📁 Categorias</h3>
            <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#27ae60' }}>
              {stats.totalCategories}
            </p>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: '20px' }}>
          <div className="card">
            <h3>📊 Tarefas por Status</h3>
            <div style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Pendentes:</span>
                <span className="status-badge status-pending">{stats.tasksByStatus.PENDING}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Em Progresso:</span>
                <span className="status-badge status-in-progress">{stats.tasksByStatus.IN_PROGRESS}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Concluídas:</span>
                <span className="status-badge status-completed">{stats.tasksByStatus.COMPLETED}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Canceladas:</span>
                <span className="status-badge status-cancelled">{stats.tasksByStatus.CANCELLED}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>⚡ Tarefas por Prioridade</h3>
            <div style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Baixa:</span>
                <span className="priority-badge priority-low">{stats.tasksByPriority.LOW}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Média:</span>
                <span className="priority-badge priority-medium">{stats.tasksByPriority.MEDIUM}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Alta:</span>
                <span className="priority-badge priority-high">{stats.tasksByPriority.HIGH}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Urgente:</span>
                <span className="priority-badge priority-urgent">{stats.tasksByPriority.URGENT}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <h3>🎯 Objetivos de Aprendizado</h3>
          <p>Este projeto foi desenvolvido para demonstrar diferentes tipos de testes de software:</p>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            <li><strong>Testes Unitários:</strong> Testam funções individuais e componentes isolados</li>
            <li><strong>Testes de Integração:</strong> Testam a integração entre diferentes partes do sistema</li>
            <li><strong>Testes de Interface:</strong> Testam a interface do usuário e fluxos completos</li>
          </ul>
          <p style={{ marginTop: '15px' }}>
            Explore as diferentes seções do sistema e experimente criar, editar e excluir registros 
            para entender melhor o funcionamento da aplicação.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
