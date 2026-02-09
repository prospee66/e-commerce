import { Router } from 'express'
import { Order, Product } from '../db/index.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now()
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `LGH-${timestamp}-${suffix}`
}

// GET /api/orders/stats (admin) - must be before /:id
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const allOrders = await Order.find({}).lean()
    const totalOrders = allOrders.length
    const totalRevenue = allOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0)

    const ordersByStatus = {
      pending: allOrders.filter(o => o.status === 'pending').length,
      processing: allOrders.filter(o => o.status === 'processing').length,
      shipped: allOrders.filter(o => o.status === 'shipped').length,
      delivered: allOrders.filter(o => o.status === 'delivered').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
    }

    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    res.json({ success: true, totalOrders, totalRevenue: totalRevenue.toFixed(2), ordersByStatus, recentOrders })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get order stats' })
  }
})

// GET /api/orders/my (authenticated user's orders)
router.get('/my', authenticate, async (req, res) => {
  try {
    const userOrders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean()
    res.json({ success: true, orders: userOrders })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your orders' })
  }
})

// GET /api/orders/track/:orderNumber (public)
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean()
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        items: order.items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, image: i.image })),
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        city: order.shippingAddress?.city || '',
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track order' })
  }
})

// GET /api/orders (admin - all orders)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query

    let query = {}
    if (status) query.status = status

    let allOrders = await Order.find(query).sort({ createdAt: -1 }).lean()

    if (search) {
      const searchLower = search.toLowerCase()
      allOrders = allOrders.filter(o =>
        (o.orderNumber || '').toLowerCase().includes(searchLower) ||
        (o.customerName || '').toLowerCase().includes(searchLower) ||
        (o.customerEmail || '').toLowerCase().includes(searchLower)
      )
    }

    const total = allOrders.length
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const totalPages = Math.ceil(total / limitNum)
    const paginatedResults = allOrders.slice((pageNum - 1) * limitNum, pageNum * limitNum)

    res.json({ success: true, orders: paginatedResults, total, page: pageNum, totalPages })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' })
  }
})

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean()
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // Regular users can only view their own orders
    if (req.user.role !== 'admin' && order.userId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' })
  }
})

// POST /api/orders (authenticated - create order after payment)
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentReference, total } = req.body

    if (!items || !items.length || !shippingAddress || !paymentMethod || !total) {
      return res.status(400).json({ success: false, message: 'Items, shipping address, payment method, and total are required' })
    }

    const orderNumber = generateOrderNumber()

    const newOrder = await Order.create({
      orderNumber,
      userId: req.user._id,
      customerName: shippingAddress.name || '',
      customerEmail: shippingAddress.email || req.user.email,
      items,
      shippingAddress,
      paymentMethod,
      paymentReference: paymentReference || '',
      paymentStatus: 'paid',
      status: 'pending',
      total: parseFloat(total),
    })

    // Decrement product stock
    for (const item of items) {
      const productId = item.productId || item._id
      if (productId) {
        await Product.updateOne({ _id: productId }, { $inc: { stock: -item.quantity } })
      }
    }

    res.status(201).json({ success: true, order: newOrder })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({ success: false, message: 'Failed to create order' })
  }
})

// PUT /api/orders/:id/status (admin - update status)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status is required' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // If cancelling, restore product stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const productId = item.productId || item._id
        if (productId) {
          await Product.updateOne({ _id: productId }, { $inc: { stock: item.quantity } })
        }
      }
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean()

    res.json({ success: true, order: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' })
  }
})

export default router
