import { Request, Response } from 'express'
import { prisma } from '../index'
import { z } from 'zod'
import { canDeleteCategory } from '../utils/categoryRules'

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional()
})

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional()
})

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        tasks: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      count: categories.length,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    })
  }
}

// Get category by ID
export const getCategoryById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            user: true
          }
        }
      }
    })

    if (!category) {
      res.status(404).json({
        success: false,
        error: 'Category not found'
      })
      return
    }

    res.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    })
  }
}

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = createCategorySchema.parse(req.body)

    const category = await prisma.category.create({
      data: validatedData,
      include: {
        tasks: true
      }
    })

    res.status(201).json({
      success: true,
      data: category
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

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      res.status(409).json({
        success: false,
        error: 'Category name already exists'
      })
      return
    }

    console.error('Error creating category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    })
  }
}

// Update category
export const updateCategory = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const validatedData = updateCategorySchema.parse(req.body)

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: {
        tasks: true
      }
    })

    res.json({
      success: true,
      data: category
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
        error: 'Category not found'
      })
      return
    }

    console.error('Error updating category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    })
  }
}

// Delete category
export const deleteCategory = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params

    // Check if category has tasks
    const tasksCount = await prisma.task.count({
      where: { categoryId: id }
    })

    if (!canDeleteCategory(tasksCount)) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete category with existing tasks'
      })
      return
    }

    await prisma.category.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      res.status(404).json({
        success: false,
        error: 'Category not found'
      })
      return
    }

    console.error('Error deleting category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    })
  }
}
