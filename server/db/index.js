import mongoose from 'mongoose'

// --- Schemas ---

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  name: String,
  email: { type: String, unique: true, lowercase: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  status: { type: String, default: 'active' },
}, { timestamps: true })

const productSchema = new mongoose.Schema({
  name: String,
  description: { type: String, default: '' },
  price: Number,
  category: String,
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  brand: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, default: 'active' },
}, { timestamps: true })

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  quantity: Number,
  price: Number,
  image: String,
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  userId: String,
  customerName: String,
  customerEmail: String,
  items: [orderItemSchema],
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    region: String,
  },
  paymentMethod: String,
  paymentReference: { type: String, default: '' },
  paymentStatus: { type: String, default: 'pending' },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  total: Number,
}, { timestamps: true })

const requestSchema = new mongoose.Schema({
  userId: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  title: String,
  description: String,
  quantity: { type: String, default: '' },
  budget: { type: String, default: '' },
  deliveryDate: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  adminNote: { type: String, default: '' },
}, { timestamps: true })

const categorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// --- Models ---

const User = mongoose.model('User', userSchema)
const Product = mongoose.model('Product', productSchema)
const Order = mongoose.model('Order', orderSchema)
const Request = mongoose.model('Request', requestSchema)
const Category = mongoose.model('Category', categorySchema)

// --- Connection ---

async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('ERROR: MONGODB_URI environment variable is required.')
    console.error('Get a free MongoDB Atlas cluster at https://www.mongodb.com/atlas')
    process.exit(1)
  }
  await mongoose.connect(uri)
  console.log('Connected to MongoDB')
}

export { User, Product, Order, Request, Category, connectDB }
