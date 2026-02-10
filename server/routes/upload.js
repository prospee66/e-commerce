import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { authenticate, requireAdmin } from '../middleware/auth.js'

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Use memory storage (buffer) instead of disk - we upload to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
})

// Helper: upload buffer to Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'lifegoesonhub', quality: 'auto', format: 'auto' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

const router = Router()

// POST /api/upload - upload a single image (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  upload.single('image')(req, res, async (err) => {
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

    try {
      const url = await uploadToCloudinary(req.file.buffer)
      res.json({ success: true, url })
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      res.status(500).json({ success: false, message: 'Failed to upload image' })
    }
  })
})

// POST /api/upload/multiple - upload multiple images (admin only)
router.post('/multiple', authenticate, requireAdmin, (req, res) => {
  upload.array('images', 5)(req, res, async (err) => {
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

    try {
      const urls = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)))
      res.json({ success: true, urls })
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      res.status(500).json({ success: false, message: 'Failed to upload images' })
    }
  })
})

export default router
