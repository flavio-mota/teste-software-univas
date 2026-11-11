import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

import app from './app'
import { prisma } from './lib/prisma'

const PORT = process.env.PORT || 3001

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API docs: http://localhost:${PORT}/api`)
})

export { prisma }
export default app
