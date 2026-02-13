import bcrypt from 'bcryptjs'
import { User, Product, Category } from './index.js'

const seedProducts = [
  { name: 'Wireless Headphones Pro', price: 299.99, description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.', category: 'electronics', brand: 'AudioTech', rating: 4.5, reviewCount: 128, stock: 15, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'], specifications: { 'Battery Life': '30 hours', 'Bluetooth': '5.0', 'Weight': '250g' }, status: 'active' },
  { name: 'Smart Watch Ultra', price: 399.99, description: 'Advanced smart watch with fitness tracking, heart rate monitor, GPS, and 5-day battery life.', category: 'electronics', brand: 'TechWear', rating: 4.8, reviewCount: 96, stock: 8, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'], specifications: { 'Battery': '5 days', 'Display': 'AMOLED' }, status: 'active' },
  { name: 'Leather Backpack', price: 89.99, description: 'Premium genuine leather backpack with multiple compartments and laptop sleeve.', category: 'fashion', brand: 'LeatherCraft', rating: 4.3, reviewCount: 54, stock: 20, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'], specifications: { 'Material': 'Genuine Leather', 'Capacity': '25L' }, status: 'active' },
  { name: 'Running Shoes Pro', price: 129.99, description: 'High-performance running shoes with advanced cushioning and breathable mesh upper.', category: 'sports', brand: 'SportMax', rating: 4.6, reviewCount: 143, stock: 25, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'], specifications: { 'Weight': '280g', 'Drop': '10mm' }, status: 'active' },
  { name: 'Coffee Maker Deluxe', price: 79.99, description: 'Programmable coffee maker with 12-cup capacity and auto-brew timer.', category: 'home', brand: 'BrewMaster', rating: 4.4, reviewCount: 87, stock: 12, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'], specifications: { 'Capacity': '12 cups', 'Timer': 'Programmable' }, status: 'active' },
  { name: 'Premium Yoga Mat', price: 39.99, description: 'Extra thick yoga mat with non-slip surface and carrying strap.', category: 'sports', brand: 'ZenFit', rating: 4.7, reviewCount: 201, stock: 35, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'], specifications: { 'Thickness': '6mm', 'Material': 'TPE' }, status: 'active' },
  { name: 'Modern Desk Lamp', price: 49.99, description: 'LED desk lamp with adjustable brightness and USB charging port.', category: 'home', brand: 'LightPro', rating: 4.2, reviewCount: 65, stock: 18, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'], specifications: { 'Power': '12W LED', 'USB Port': 'Yes' }, status: 'active' },
  { name: 'Designer Sunglasses', price: 159.99, description: 'Premium polarized sunglasses with UV400 protection.', category: 'fashion', brand: 'SunShield', rating: 4.5, reviewCount: 112, stock: 22, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'], specifications: { 'Protection': 'UV400', 'Lens': 'Polarized' }, status: 'active' },
  { name: 'Laptop 15" 16GB RAM', price: 1299.99, description: 'High-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD.', category: 'electronics', brand: 'TechPro', rating: 4.7, reviewCount: 89, stock: 10, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'], specifications: { 'Processor': 'Intel Core i7', 'RAM': '16GB', 'Storage': '512GB SSD' }, status: 'active' },
  { name: 'Wireless Mouse', price: 49.99, description: 'Ergonomic wireless mouse with precision tracking.', category: 'electronics', brand: 'TechGear', rating: 4.4, reviewCount: 156, stock: 45, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800'], specifications: { 'DPI': '1600', 'Battery': '12 months' }, status: 'active' },
  { name: 'Mechanical Keyboard', price: 149.99, description: 'RGB mechanical keyboard with cherry MX switches.', category: 'electronics', brand: 'GameTech', rating: 4.6, reviewCount: 134, stock: 28, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'], specifications: { 'Switches': 'Cherry MX', 'Backlight': 'RGB' }, status: 'active' },
  { name: 'Bluetooth Speaker', price: 89.99, description: 'Portable Bluetooth speaker with 360 sound and waterproof design.', category: 'electronics', brand: 'SoundWave', rating: 4.5, reviewCount: 203, stock: 32, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'], specifications: { 'Battery': '20 hours', 'Waterproof': 'IPX7' }, status: 'active' },
  { name: 'Wireless Earbuds', price: 129.99, description: 'True wireless earbuds with active noise cancellation.', category: 'electronics', brand: 'AudioPro', rating: 4.8, reviewCount: 245, stock: 42, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'], specifications: { 'ANC': 'Yes', 'Battery': '24 hours' }, status: 'active' },
  { name: 'Casual T-Shirt', price: 29.99, description: 'Comfortable cotton t-shirt for everyday wear.', category: 'fashion', brand: 'ComfortWear', rating: 4.2, reviewCount: 89, stock: 150, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'], specifications: { 'Material': '100% Cotton' }, status: 'active' },
  { name: 'Denim Jeans', price: 79.99, description: 'Classic denim jeans with modern fit.', category: 'fashion', brand: 'DenimCo', rating: 4.4, reviewCount: 112, stock: 80, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], specifications: { 'Material': 'Denim', 'Fit': 'Slim' }, status: 'active' },
  { name: 'Leather Jacket', price: 249.99, description: 'Premium leather jacket with classic design.', category: 'fashion', brand: 'LeatherLux', rating: 4.7, reviewCount: 67, stock: 15, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'], specifications: { 'Material': 'Genuine Leather' }, status: 'active' },
  { name: 'Canvas Sneakers', price: 69.99, description: 'Stylish canvas sneakers for all-day wear.', category: 'fashion', brand: 'FootStyle', rating: 4.3, reviewCount: 145, stock: 95, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500', images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'], specifications: { 'Material': 'Canvas', 'Sole': 'Rubber' }, status: 'active' },
  { name: 'Air Purifier HEPA', price: 199.99, description: 'HEPA air purifier with smart sensors.', category: 'home', brand: 'PureAir', rating: 4.6, reviewCount: 134, stock: 22, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800'], specifications: { 'Filter': 'HEPA', 'Coverage': '400 sq ft' }, status: 'active' },
  { name: 'Blender 1000W', price: 89.99, description: 'Powerful 1000W blender for smoothies.', category: 'home', brand: 'BlendMaster', rating: 4.5, reviewCount: 189, stock: 38, image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500', images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800'], specifications: { 'Power': '1000W', 'Capacity': '1.5L' }, status: 'active' },
  { name: 'Kitchen Knife Set', price: 129.99, description: 'Professional 8-piece knife set with wooden block.', category: 'home', brand: 'ChefPro', rating: 4.7, reviewCount: 156, stock: 28, image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500', images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800'], specifications: { 'Pieces': '8', 'Material': 'Stainless Steel' }, status: 'active' },
  { name: 'Dumbbell Set 20kg', price: 89.99, description: 'Adjustable dumbbell set, 20kg total.', category: 'sports', brand: 'FitGear', rating: 4.5, reviewCount: 167, stock: 30, image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500', images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800'], specifications: { 'Weight': '20kg', 'Adjustable': 'Yes' }, status: 'active' },
  { name: 'Basketball Official Size', price: 49.99, description: 'Official size basketball with excellent grip.', category: 'sports', brand: 'CourtKing', rating: 4.6, reviewCount: 189, stock: 55, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'], specifications: { 'Size': 'Official' }, status: 'active' },
  { name: 'Fitness Tracker Watch', price: 99.99, description: 'Fitness tracker with heart rate and GPS.', category: 'sports', brand: 'FitTrack', rating: 4.8, reviewCount: 289, stock: 45, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500', images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800'], specifications: { 'GPS': 'Yes', 'Heart Rate': 'Yes', 'Battery': '7 days' }, status: 'active' },
  { name: 'Soccer Ball FIFA', price: 39.99, description: 'FIFA approved soccer ball for official play.', category: 'sports', brand: 'GoalMaster', rating: 4.5, reviewCount: 234, stock: 70, image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500', images: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'], specifications: { 'Size': '5', 'FIFA': 'Approved' }, status: 'active' },
]

export async function seedDatabase() {
  try {
    // Seed admin user - remove old admin and create fresh
    await User.deleteMany({ role: 'admin' })
    const hashedPassword = await bcrypt.hash('afraH@130199', 10)
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      email: 'possiblefrank@gmail.com',
      phone: '0200000000',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    })
    console.log('Admin user ready: possiblefrank@gmail.com')

    // Seed products
    const productCount = await Product.countDocuments({})
    if (productCount === 0) {
      await Product.insertMany(seedProducts)
      console.log(`${seedProducts.length} products seeded`)
    }

    // Seed categories
    const categoryCount = await Category.countDocuments({})
    if (categoryCount === 0) {
      await Category.insertMany([
        { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop', description: 'Gadgets, devices and tech accessories', order: 1 },
        { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop', description: 'Clothing, shoes and accessories', order: 2 },
        { name: 'Home & Garden', slug: 'home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=300&fit=crop', description: 'Furniture, decor and garden tools', order: 3 },
        { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=300&fit=crop', description: 'Equipment, apparel and fitness gear', order: 4 },
      ])
      console.log('4 categories seeded')
    }
  } catch (error) {
    console.error('Seed error:', error)
  }
}
