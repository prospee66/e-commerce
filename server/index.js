import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { connectDB } from './db/index.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import userRoutes from './routes/users.js'
import orderRoutes from './routes/orders.js'
import uploadRoutes from './routes/upload.js'
import requestRoutes from './routes/requests.js'
import categoryRoutes from './routes/categories.js'
import { seedDatabase } from './db/seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Use Render persistent disk for uploads in production
const uploadsDir = process.env.RENDER
  ? '/opt/render/project/src/data/uploads'
  : path.join(__dirname, 'uploads')

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true)
    }
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true)
    }
    callback(null, false)
  },
  credentials: true,
}))
app.use(express.json())

// Serve uploaded images as static files
app.use('/uploads', express.static(uploadsDir))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/categories', categoryRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

// Start server - connect to MongoDB first
async function start() {
  await connectDB()
  await seedDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
