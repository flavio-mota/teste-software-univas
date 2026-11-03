import { Request, Response } from 'express'
import { prisma } from '../index'
import { z } from 'zod'

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  userId: z.string().min(1, 'User ID is required'),
  categoryId: z.string().min(1, 'Category ID is required')
})

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  userId: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional()
})

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { status, priority, userId, categoryId } = req.query

    const where: any = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (userId) where.userId = userId
    if (categoryId) where.categoryId = categoryId

    const tasks = await prisma.task.findMany({
      where,
      include: {
        user: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    })
  }
}

// Get task by ID
export const getTaskById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
        category: true
      }
    })

    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      })
      return
    }

    res.json({
      success: true,
      data: task
    })
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    })
  }
}

// Create new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const validatedData = createTaskSchema.parse(req.body)

    // Verify user and category exist
    const user = await prisma.user.findUnique({ where: { id: validatedData.userId } })
    const category = await prisma.category.findUnique({ where: { id: validatedData.categoryId } })

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      })
      return
    }

    if (!category) {
      res.status(404).json({
        success: false,
        error: 'Category not found'
      })
      return
    }

    const task = await prisma.task.create({
      data: validatedData,
      include: {
        user: true,
        category: true
      }
    })

    res.status(201).json({
      success: true,
      data: task
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues
      })
      return
    }

    console.error('Error creating task:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    })
  }
}

// Update task
export const updateTask = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const validatedData = updateTaskSchema.parse(req.body)

    // If updating userId or categoryId, verify they exist
    if (validatedData.userId) {
      const user = await prisma.user.findUnique({ where: { id: validatedData.userId } })
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        })
        return
      }
    }

    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: validatedData.categoryId } })
      if (!category) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        })
        return
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: validatedData,
      include: {
        user: true,
        category: true
      }
    })

    res.json({
      success: true,
      data: task
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues
      })
      return
    }

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      })
      return
    }

    console.error('Error updating task:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    })
  }
}

// Delete task
export const deleteTask = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params

    await prisma.task.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      })
      return
    }

    console.error('Error deleting task:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    })
  }
}
