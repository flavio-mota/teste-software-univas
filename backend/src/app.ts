import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

// Import routes
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/taskRoutes'
import categoryRoutes from './routes/categoryRoutes'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// A aplicação Express é montada aqui, SEM chamar app.listen().
// Assim ela pode ser importada nos testes (ex.: Supertest) sem subir o servidor.
const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'teste-software-backend'
  })
})

// API routes
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/categories', categoryRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

export default app
