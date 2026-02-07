import { Router } from 'express'
import { requests, users } from '../db/index.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/requests/stats (admin)
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const all = await requests.find({})
    const total = all.length
    const pending = all.filter(r => r.status === 'pending').length
    const approved = all.filter(r => r.status === 'approved').length
    const rejected = all.filter(r => r.status === 'rejected').length
    res.json({ success: true, total, pending, approved, rejected })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get stats' })
  }
})

// GET /api/requests/my (user's own requests)
router.get('/my', authenticate, async (req, res) => {
  try {
    const userRequests = await requests.find({ userId: req.user._id })
    userRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ success: true, requests: userRequests })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests' })
  }
})

// GET /api/requests (admin - all requests)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query
    let query = {}
    if (status) query.status = status
    let results = await requests.find(query)

    if (search) {
      const s = search.toLowerCase()
      results = results.filter(r =>
        r.title?.toLowerCase().includes(s) ||
        r.customerName?.toLowerCase().includes(s) ||
        r.customerEmail?.toLowerCase().includes(s)
      )
    }

    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ success: true, requests: results })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests' })
  }
})

// GET /api/requests/:id (single request)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const request = await requests.findOne({ _id: req.params.id })
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }
    // Users can only see their own requests
    if (req.user.role !== 'admin' && request.userId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    res.json({ success: true, request })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch request' })
  }
})

// POST /api/requests (create request - any authenticated user)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, quantity, budget, deliveryDate } = req.body

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' })
    }

    const user = await users.findOne({ _id: req.user._id })
    const newRequest = await requests.insert({
      userId: req.user._id,
      customerName: user?.name || 'Unknown',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      title,
      description,
      quantity: quantity || '',
      budget: budget || '',
      deliveryDate: deliveryDate || '',
      status: 'pending',
      adminNote: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    res.status(201).json({ success: true, request: newRequest })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create request' })
  }
})

// PUT /api/requests/:id/status (admin - update status + note)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body
    const valid = ['pending', 'in-review', 'approved', 'rejected']
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const existing = await requests.findOne({ _id: req.params.id })
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }

    const updates = { status, updatedAt: new Date() }
    if (adminNote !== undefined) updates.adminNote = adminNote

    await requests.update({ _id: req.params.id }, { $set: updates })
    const updated = await requests.findOne({ _id: req.params.id })

    res.json({ success: true, request: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update request' })
  }
})

// DELETE /api/requests/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const existing = await requests.findOne({ _id: req.params.id })
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Request not found' })
    }
    await requests.remove({ _id: req.params.id })
    res.json({ success: true, message: 'Request deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete request' })
  }
})

export default router
