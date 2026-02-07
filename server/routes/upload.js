import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', 'uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
})

const router = Router()

// POST /api/upload - upload a single image (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' })
      }
      return res.status(400).json({ success: false, message: err.message })
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message })
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    res.json({ success: true, url: imageUrl })
  })
})

// POST /api/upload/multiple - upload multiple images (admin only)
router.post('/multiple', authenticate, requireAdmin, (req, res) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB per file.' })
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ success: false, message: 'Maximum 5 images allowed.' })
      }
      return res.status(400).json({ success: false, message: err.message })
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message })
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' })
    }

    const urls = req.files.map(f => `/uploads/${f.filename}`)
    res.json({ success: true, urls })
  })
})

export default router
