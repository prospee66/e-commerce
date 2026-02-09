import { Router } from 'express'
import { Category } from '../db/index.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/categories - Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.find({}).sort({ order: 1, name: 1 }).lean()
    res.json({ categories: allCategories })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' })
  }
})

// POST /api/categories - Create category (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, slug, image, description, order } = req.body

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required' })
    }

    // Check for duplicate slug
    const existing = await Category.findOne({ slug })
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this slug already exists' })
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      image: image || '',
      description: description || '',
      order: order || 0,
    })

    res.status(201).json({ success: true, category })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category' })
  }
})

// PUT /api/categories/:id - Update category (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, slug, image, description, order } = req.body

    // Check for duplicate slug (excluding current)
    if (slug) {
      const existing = await Category.findOne({ slug, _id: { $ne: req.params.id } })
      if (existing) {
        return res.status(400).json({ success: false, message: 'A category with this slug already exists' })
      }
    }

    const updates = {}
    if (name !== undefined) updates.name = name
    if (slug !== undefined) updates.slug = slug.toLowerCase().replace(/\s+/g, '-')
    if (image !== undefined) updates.image = image
    if (description !== undefined) updates.description = description
    if (order !== undefined) updates.order = order

    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true }).lean()
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    res.json({ success: true, category })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category' })
  }
})

// DELETE /api/categories/:id - Delete category (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }
    res.json({ success: true, message: 'Category deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' })
  }
})

export default router
