import { Router } from 'express'
import { Product } from '../db/index.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/products/stats (admin) - must be before /:id
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const allProducts = await Product.find({}).lean()
    const total = allProducts.length
    const active = allProducts.filter(p => p.stock > 0).length
    const outOfStock = allProducts.filter(p => p.stock === 0).length
    const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)

    const byCategory = {}
    allProducts.forEach(p => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1
    })

    res.json({ success: true, total, active, outOfStock, totalValue: totalValue.toFixed(2), byCategory })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get stats' })
  }
})

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, inStock, sort, page = 1, limit = 50 } = req.query

    let query = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.name = { $regex: new RegExp(search, 'i') }
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 }
    }

    let results = await Product.find(query).lean()

    // Apply price filters
    if (minPrice) {
      results = results.filter(p => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      results = results.filter(p => p.price <= parseFloat(maxPrice))
    }

    // Sort
    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating)
    } else if (sort === 'newest') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    const total = results.length
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const totalPages = Math.ceil(total / limitNum)
    const paginatedResults = results.slice((pageNum - 1) * limitNum, pageNum * limitNum)

    res.json({
      success: true,
      products: paginatedResults,
      total,
      page: pageNum,
      totalPages,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean()
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' })
  }
})

// POST /api/products (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, image, images, brand, status } = req.body

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' })
    }

    const newProduct = await Product.create({
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0,
      image: image || '',
      images: images || (image ? [image] : []),
      brand: brand || '',
      rating: 0,
      reviewCount: 0,
      specifications: {},
      status: status || 'active',
    })

    res.status(201).json({ success: true, product: newProduct })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product' })
  }
})

// PUT /api/products/:id (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, image, images, brand, status } = req.body

    const existing = await Product.findById(req.params.id)
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const updates = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (price !== undefined) updates.price = parseFloat(price)
    if (category !== undefined) updates.category = category
    if (stock !== undefined) updates.stock = parseInt(stock)
    if (image !== undefined) updates.image = image
    if (images !== undefined) updates.images = images
    if (brand !== undefined) updates.brand = brand
    if (status !== undefined) updates.status = status

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).lean()

    res.json({ success: true, product: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' })
  }
})

// DELETE /api/products/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id)
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' })
  }
})

export default router
