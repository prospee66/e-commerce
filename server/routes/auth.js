import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../db/index.js'
import { authenticate, generateToken } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'First name, last name, email, phone, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const name = `${firstName} ${lastName}`
    const newUser = await User.create({
      firstName,
      lastName,
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'customer',
      status: 'active',
    })

    const token = generateToken(newUser)

    res.status(201).json({
      success: true,
      user: { _id: newUser._id, name: newUser.name, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, phone: newUser.phone, role: newUser.role },
      token,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = generateToken(user)

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role },
      token,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' })
  }
})

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user' })
  }
})

export default router
