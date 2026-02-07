import { Router } from 'express'
import { users } from '../db/index.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/users/stats (admin)
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const allUsers = await users.find({})
    const total = allUsers.length
    const customers = allUsers.filter(u => u.role === 'customer').length
    const admins = allUsers.filter(u => u.role === 'admin').length

    res.json({ success: true, total, customers, admins })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user stats' })
  }
})

// GET /api/users (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const allUsers = await users.find({})
    const sanitized = allUsers.map(({ password, ...rest }) => rest)
    res.json({ success: true, users: sanitized })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' })
  }
})

// DELETE /api/users/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.params.id })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user' })
    }
    await users.remove({ _id: req.params.id })
    res.json({ success: true, message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' })
  }
})

export default router
