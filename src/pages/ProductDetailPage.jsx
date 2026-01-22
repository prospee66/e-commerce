import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'

// Mock products database
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones Pro',
    price: 299.99,
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
    category: 'Electronics',
    brand: 'AudioTech',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
    ],
    specifications: {
      'Battery Life': '30 hours',
      'Bluetooth Version': '5.0',
      'Weight': '250g',
      'Warranty': '2 years',
    },
    reviews: [
      { id: 1, user: 'John D.', rating: 5, comment: 'Amazing sound quality!', date: '2024-01-15' },
      { id: 2, user: 'Sarah M.', rating: 4, comment: 'Great product, comfortable to wear', date: '2024-01-10' },
    ],
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 399.99,
    description: 'Advanced smart watch with fitness tracking, heart rate monitor, GPS, and 5-day battery life. Stay connected and healthy.',
    category: 'Electronics',
    brand: 'TechWear',
    rating: 4.8,
    reviewCount: 96,
    inStock: true,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
    ],
    specifications: {
      'Battery Life': '5 days',
      'Display': 'AMOLED',
      'Water Resistance': '50m',
      'Warranty': '1 year',
    },
    reviews: [
      { id: 1, user: 'Mike T.', rating: 5, comment: 'Best smart watch I ever owned!', date: '2024-01-12' },
      { id: 2, user: 'Lisa K.', rating: 5, comment: 'Excellent fitness tracking features', date: '2024-01-08' },
    ],
  },
  {
    id: 3,
    name: 'Leather Backpack',
    price: 89.99,
    description: 'Premium genuine leather backpack with multiple compartments, laptop sleeve, and water-resistant coating. Perfect for work or travel.',
    category: 'Fashion',
    brand: 'LeatherCraft',
    rating: 4.3,
    reviewCount: 54,
    inStock: true,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    ],
    specifications: {
      'Material': 'Genuine Leather',
      'Capacity': '25L',
      'Laptop Size': 'Up to 15"',
      'Warranty': '2 years',
    },
    reviews: [
      { id: 1, user: 'David R.', rating: 4, comment: 'Great quality leather, very durable', date: '2024-01-14' },
      { id: 2, user: 'Emma P.', rating: 5, comment: 'Love the design and functionality', date: '2024-01-09' },
    ],
  },
  {
    id: 4,
    name: 'Running Shoes',
    price: 129.99,
    description: 'High-performance running shoes with advanced cushioning, breathable mesh upper, and durable outsole. Designed for serious runners.',
    category: 'Sports',
    brand: 'SportMax',
    rating: 4.6,
    reviewCount: 143,
    inStock: false,
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',
    ],
    specifications: {
      'Weight': '280g',
      'Drop': '10mm',
      'Upper': 'Breathable Mesh',
      'Warranty': '6 months',
    },
    reviews: [
      { id: 1, user: 'Tom S.', rating: 5, comment: 'Perfect for long distance running', date: '2024-01-11' },
      { id: 2, user: 'Anna B.', rating: 4, comment: 'Very comfortable and lightweight', date: '2024-01-07' },
    ],
  },
  {
    id: 5,
    name: 'Coffee Maker',
    price: 79.99,
    description: 'Programmable coffee maker with 12-cup capacity, auto-brew timer, and keep-warm function. Makes perfect coffee every morning.',
    category: 'Home & Garden',
    brand: 'BrewMaster',
    rating: 4.4,
    reviewCount: 87,
    inStock: true,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
    ],
    specifications: {
      'Capacity': '12 cups',
      'Timer': 'Programmable',
      'Filter': 'Permanent',
      'Warranty': '1 year',
    },
    reviews: [
      { id: 1, user: 'James W.', rating: 4, comment: 'Makes great coffee consistently', date: '2024-01-13' },
      { id: 2, user: 'Maria G.', rating: 5, comment: 'Easy to use and clean', date: '2024-01-06' },
    ],
  },
  {
    id: 6,
    name: 'Yoga Mat',
    price: 39.99,
    description: 'Extra thick yoga mat with non-slip surface and carrying strap. Perfect for yoga, pilates, and floor exercises.',
    category: 'Sports',
    brand: 'ZenFit',
    rating: 4.7,
    reviewCount: 201,
    inStock: true,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800',
      'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=800',
    ],
    specifications: {
      'Thickness': '6mm',
      'Material': 'TPE',
      'Dimensions': '183cm x 61cm',
      'Warranty': '1 year',
    },
    reviews: [
      { id: 1, user: 'Sophie L.', rating: 5, comment: 'Best yoga mat ever, very comfortable', date: '2024-01-10' },
      { id: 2, user: 'Chris M.', rating: 5, comment: 'Non-slip surface works great', date: '2024-01-05' },
    ],
  },
  {
    id: 7,
    name: 'Desk Lamp',
    price: 49.99,
    description: 'LED desk lamp with adjustable brightness, color temperature control, and USB charging port. Energy efficient and eye-friendly.',
    category: 'Home & Garden',
    brand: 'LightPro',
    rating: 4.2,
    reviewCount: 65,
    inStock: true,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800',
    ],
    specifications: {
      'Power': '12W LED',
      'Color Temp': '2700K-6500K',
      'USB Port': 'Yes',
      'Warranty': '1 year',
    },
    reviews: [
      { id: 1, user: 'Rachel N.', rating: 4, comment: 'Perfect for my home office', date: '2024-01-09' },
      { id: 2, user: 'Kevin H.', rating: 4, comment: 'Good brightness levels', date: '2024-01-04' },
    ],
  },
  {
    id: 8,
    name: 'Designer Sunglasses',
    price: 159.99,
    description: 'Premium polarized sunglasses with UV400 protection and scratch-resistant lenses. Stylish and functional for any occasion.',
    category: 'Fashion',
    brand: 'SunShield',
    rating: 4.5,
    reviewCount: 112,
    inStock: true,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
    ],
    specifications: {
      'Protection': 'UV400',
      'Lens': 'Polarized',
      'Frame': 'Metal Alloy',
      'Warranty': '1 year',
    },
    reviews: [
      { id: 1, user: 'Nina F.', rating: 5, comment: 'Love these! Very stylish and protective', date: '2024-01-08' },
      { id: 2, user: 'Alex J.', rating: 4, comment: 'Great quality for the price', date: '2024-01-03' },
    ],
  },
  // Additional Electronics
  { id: 9, name: 'Laptop 15" 16GB RAM', price: 1299.99, description: 'High-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD. Perfect for work and entertainment.', category: 'Electronics', brand: 'TechPro', rating: 4.7, reviewCount: 89, inStock: true, stock: 10, images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'], specifications: { 'Processor': 'Intel Core i7', 'RAM': '16GB', 'Storage': '512GB SSD', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Paul R.', rating: 5, comment: 'Fast and reliable!', date: '2024-01-15' }] },
  { id: 10, name: 'Wireless Mouse', price: 49.99, description: 'Ergonomic wireless mouse with precision tracking and long battery life.', category: 'Electronics', brand: 'TechGear', rating: 4.4, reviewCount: 156, inStock: true, stock: 45, images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800'], specifications: { 'DPI': '1600', 'Battery': '12 months', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Sam W.', rating: 4, comment: 'Comfortable to use', date: '2024-01-12' }] },
  { id: 11, name: 'Mechanical Keyboard', price: 149.99, description: 'RGB mechanical keyboard with cherry MX switches. Perfect for gaming and typing.', category: 'Electronics', brand: 'GameTech', rating: 4.6, reviewCount: 134, inStock: true, stock: 28, images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'], specifications: { 'Switches': 'Cherry MX', 'Backlight': 'RGB', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Jake P.', rating: 5, comment: 'Best keyboard ever!', date: '2024-01-14' }] },
  { id: 12, name: 'USB-C Hub 7-in-1', price: 69.99, description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and more.', category: 'Electronics', brand: 'ConnectPro', rating: 4.3, reviewCount: 78, inStock: true, stock: 40, images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800'], specifications: { 'Ports': '7', 'HDMI': '4K@30Hz', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Linda M.', rating: 4, comment: 'Very useful', date: '2024-01-10' }] },
  { id: 13, name: 'Bluetooth Speaker', price: 89.99, description: 'Portable Bluetooth speaker with 360° sound and waterproof design.', category: 'Electronics', brand: 'SoundWave', rating: 4.5, reviewCount: 203, inStock: true, stock: 32, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'], specifications: { 'Battery': '20 hours', 'Waterproof': 'IPX7', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Mark H.', rating: 5, comment: 'Amazing sound quality', date: '2024-01-13' }] },
  { id: 14, name: '4K Webcam', price: 179.99, description: '4K webcam with auto-focus and built-in microphone. Perfect for streaming.', category: 'Electronics', brand: 'StreamCam', rating: 4.7, reviewCount: 92, inStock: false, stock: 0, images: ['https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=800'], specifications: { 'Resolution': '4K@30fps', 'Microphone': 'Built-in', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Amy L.', rating: 5, comment: 'Crystal clear video', date: '2024-01-11' }] },
  { id: 15, name: 'Portable Charger 20000mAh', price: 59.99, description: 'High-capacity portable charger with fast charging for all devices.', category: 'Electronics', brand: 'PowerBank', rating: 4.6, reviewCount: 167, inStock: true, stock: 55, images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'], specifications: { 'Capacity': '20000mAh', 'Fast Charge': 'Yes', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Dan K.', rating: 5, comment: 'Charges my phone 4 times!', date: '2024-01-09' }] },
  { id: 16, name: 'Tablet 10" 128GB', price: 449.99, description: '10-inch tablet with 128GB storage, perfect for entertainment and productivity.', category: 'Electronics', brand: 'TabletPro', rating: 4.5, reviewCount: 118, inStock: true, stock: 18, images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'], specifications: { 'Display': '10" IPS', 'Storage': '128GB', 'Battery': '10 hours', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Carol B.', rating: 4, comment: 'Great for reading', date: '2024-01-08' }] },
  { id: 17, name: 'Wireless Earbuds', price: 129.99, description: 'True wireless earbuds with active noise cancellation and 24-hour battery.', category: 'Electronics', brand: 'AudioPro', rating: 4.8, reviewCount: 245, inStock: true, stock: 42, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'], specifications: { 'ANC': 'Yes', 'Battery': '24 hours', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Ben T.', rating: 5, comment: 'Sound is incredible', date: '2024-01-12' }] },
  { id: 18, name: 'Gaming Headset RGB', price: 199.99, description: 'Professional gaming headset with 7.1 surround sound and RGB lighting.', category: 'Electronics', brand: 'GameSound', rating: 4.6, reviewCount: 178, inStock: true, stock: 25, images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=800'], specifications: { 'Surround': '7.1', 'Microphone': 'Noise-cancelling', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Tyler G.', rating: 5, comment: 'Perfect for gaming', date: '2024-01-07' }] },
  // Fashion
  { id: 19, name: 'Casual T-Shirt', price: 29.99, description: 'Comfortable cotton t-shirt, perfect for everyday wear.', category: 'Fashion', brand: 'ComfortWear', rating: 4.2, reviewCount: 89, inStock: true, stock: 150, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'], specifications: { 'Material': '100% Cotton', 'Fit': 'Regular', 'Warranty': '6 months' }, reviews: [{ id: 1, user: 'Jane D.', rating: 4, comment: 'Very comfortable', date: '2024-01-15' }] },
  { id: 20, name: 'Denim Jeans', price: 79.99, description: 'Classic denim jeans with modern fit and durable construction.', category: 'Fashion', brand: 'DenimCo', rating: 4.4, reviewCount: 112, inStock: true, stock: 80, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], specifications: { 'Material': 'Denim', 'Fit': 'Slim', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Mike S.', rating: 4, comment: 'Great fit', date: '2024-01-14' }] },
  { id: 21, name: 'Leather Jacket', price: 249.99, description: 'Premium leather jacket with classic design and superior craftsmanship.', category: 'Fashion', brand: 'LeatherLux', rating: 4.7, reviewCount: 67, inStock: true, stock: 15, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'], specifications: { 'Material': 'Genuine Leather', 'Lining': 'Polyester', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Rob C.', rating: 5, comment: 'High quality leather', date: '2024-01-13' }] },
  { id: 22, name: 'Canvas Sneakers', price: 69.99, description: 'Stylish canvas sneakers, comfortable for all-day wear.', category: 'Fashion', brand: 'FootStyle', rating: 4.3, reviewCount: 145, inStock: true, stock: 95, images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'], specifications: { 'Material': 'Canvas', 'Sole': 'Rubber', 'Warranty': '6 months' }, reviews: [{ id: 1, user: 'Sara P.', rating: 4, comment: 'Very comfortable', date: '2024-01-11' }] },
  { id: 23, name: 'Wool Scarf', price: 39.99, description: 'Soft wool scarf, perfect for cold weather.', category: 'Fashion', brand: 'WarmWear', rating: 4.5, reviewCount: 78, inStock: true, stock: 60, images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800'], specifications: { 'Material': 'Wool', 'Size': '180cm', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Emily R.', rating: 5, comment: 'Very warm and soft', date: '2024-01-10' }] },
  { id: 24, name: 'Leather Belt', price: 49.99, description: 'Classic leather belt with metal buckle.', category: 'Fashion', brand: 'BeltMaster', rating: 4.4, reviewCount: 92, inStock: true, stock: 70, images: ['https://images.unsplash.com/photo-1556306535-38febf6782e7?w=800', 'https://images.unsplash.com/photo-1624998159679-4c0ce0c2834a?w=800'], specifications: { 'Material': 'Leather', 'Width': '3.5cm', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'John W.', rating: 4, comment: 'Good quality belt', date: '2024-01-09' }] },
  { id: 25, name: 'Canvas Tote Bag', price: 44.99, description: 'Eco-friendly canvas tote bag for everyday use.', category: 'Fashion', brand: 'EcoBag', rating: 4.2, reviewCount: 134, inStock: true, stock: 100, images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'], specifications: { 'Material': 'Canvas', 'Capacity': '15L', 'Warranty': '6 months' }, reviews: [{ id: 1, user: 'Lisa M.', rating: 4, comment: 'Perfect size', date: '2024-01-08' }] },
  { id: 26, name: 'Winter Coat', price: 189.99, description: 'Warm winter coat with insulated lining.', category: 'Fashion', brand: 'WinterWear', rating: 4.6, reviewCount: 56, inStock: false, stock: 0, images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'], specifications: { 'Material': 'Polyester', 'Insulation': 'Down', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Tom B.', rating: 5, comment: 'Very warm', date: '2024-01-07' }] },
  { id: 27, name: 'Crossbody Bag', price: 64.99, description: 'Stylish crossbody bag with multiple compartments.', category: 'Fashion', brand: 'BagStyle', rating: 4.5, reviewCount: 101, inStock: true, stock: 45, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'], specifications: { 'Material': 'Faux Leather', 'Compartments': '3', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Anna K.', rating: 5, comment: 'Love the design', date: '2024-01-06' }] },
  { id: 28, name: 'Baseball Cap', price: 24.99, description: 'Classic baseball cap with adjustable strap.', category: 'Fashion', brand: 'CapCo', rating: 4.3, reviewCount: 167, inStock: true, stock: 120, images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'], specifications: { 'Material': 'Cotton', 'Adjustable': 'Yes', 'Warranty': '6 months' }, reviews: [{ id: 1, user: 'Chris H.', rating: 4, comment: 'Good quality cap', date: '2024-01-05' }] },
  // Home & Garden
  { id: 29, name: 'Air Purifier HEPA', price: 199.99, description: 'HEPA air purifier with smart sensors and quiet operation.', category: 'Home & Garden', brand: 'PureAir', rating: 4.6, reviewCount: 134, inStock: true, stock: 22, images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800'], specifications: { 'Filter': 'HEPA', 'Coverage': '400 sq ft', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Helen P.', rating: 5, comment: 'Air feels fresher', date: '2024-01-15' }] },
  { id: 30, name: 'Blender 1000W', price: 89.99, description: 'Powerful 1000W blender for smoothies and more.', category: 'Home & Garden', brand: 'BlendMaster', rating: 4.5, reviewCount: 189, inStock: true, stock: 38, images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800', 'https://images.unsplash.com/photo-1585515320310-259814833379?w=800'], specifications: { 'Power': '1000W', 'Capacity': '1.5L', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Nancy T.', rating: 5, comment: 'Makes perfect smoothies', date: '2024-01-14' }] },
  { id: 31, name: 'Ceramic Plant Pot Set', price: 34.99, description: 'Set of 3 ceramic plant pots with drainage.', category: 'Home & Garden', brand: 'GardenStyle', rating: 4.4, reviewCount: 98, inStock: true, stock: 75, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'], specifications: { 'Material': 'Ceramic', 'Pieces': '3', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Grace L.', rating: 4, comment: 'Beautiful pots', date: '2024-01-13' }] },
  { id: 32, name: 'Kitchen Knife Set', price: 129.99, description: 'Professional knife set with 8 pieces and wooden block.', category: 'Home & Garden', brand: 'ChefPro', rating: 4.7, reviewCount: 156, inStock: true, stock: 28, images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800'], specifications: { 'Pieces': '8', 'Material': 'Stainless Steel', 'Warranty': 'Lifetime' }, reviews: [{ id: 1, user: 'Frank D.', rating: 5, comment: 'Very sharp knives', date: '2024-01-12' }] },
  { id: 33, name: 'Wall Clock Modern', price: 44.99, description: 'Modern wall clock with silent movement.', category: 'Home & Garden', brand: 'TimeStyle', rating: 4.3, reviewCount: 87, inStock: true, stock: 50, images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800'], specifications: { 'Diameter': '30cm', 'Movement': 'Quartz', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Betty M.', rating: 4, comment: 'Looks great on my wall', date: '2024-01-11' }] },
  { id: 34, name: 'Throw Pillow Set (4)', price: 54.99, description: 'Set of 4 decorative throw pillows.', category: 'Home & Garden', brand: 'HomeDeco', rating: 4.5, reviewCount: 123, inStock: true, stock: 65, images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800'], specifications: { 'Pieces': '4', 'Size': '45x45cm', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Diane R.', rating: 5, comment: 'Very comfortable', date: '2024-01-10' }] },
  { id: 35, name: 'Area Rug 5x7', price: 149.99, description: '5x7 feet area rug with modern design.', category: 'Home & Garden', brand: 'RugMaster', rating: 4.4, reviewCount: 78, inStock: true, stock: 20, images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800'], specifications: { 'Size': '5x7 feet', 'Material': 'Polyester', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'George H.', rating: 4, comment: 'Nice rug', date: '2024-01-09' }] },
  { id: 36, name: 'Garden Tool Set', price: 69.99, description: 'Complete garden tool set with 5 essential tools.', category: 'Home & Garden', brand: 'GardenPro', rating: 4.6, reviewCount: 145, inStock: true, stock: 42, images: ['https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=800'], specifications: { 'Pieces': '5', 'Material': 'Steel', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Henry W.', rating: 5, comment: 'Great tools', date: '2024-01-08' }] },
  { id: 37, name: 'Vacuum Cleaner Robot', price: 349.99, description: 'Smart robot vacuum with app control and auto-charge.', category: 'Home & Garden', brand: 'CleanBot', rating: 4.7, reviewCount: 201, inStock: false, stock: 0, images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'], specifications: { 'Battery': '120 min', 'App': 'Yes', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Iris J.', rating: 5, comment: 'Cleans everything', date: '2024-01-07' }] },
  { id: 38, name: 'Standing Fan 16"', price: 79.99, description: '16-inch standing fan with remote control.', category: 'Home & Garden', brand: 'CoolAir', rating: 4.2, reviewCount: 112, inStock: true, stock: 35, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], specifications: { 'Size': '16 inch', 'Remote': 'Yes', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Jack K.', rating: 4, comment: 'Cools well', date: '2024-01-06' }] },
  // Sports
  { id: 39, name: 'Dumbbell Set 20kg', price: 89.99, description: 'Adjustable dumbbell set, 20kg total weight.', category: 'Sports', brand: 'FitGear', rating: 4.5, reviewCount: 167, inStock: true, stock: 30, images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800'], specifications: { 'Weight': '20kg', 'Adjustable': 'Yes', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Kyle M.', rating: 5, comment: 'Great for home gym', date: '2024-01-15' }] },
  { id: 40, name: 'Resistance Bands Set', price: 29.99, description: 'Set of 5 resistance bands with different levels.', category: 'Sports', brand: 'FlexFit', rating: 4.4, reviewCount: 234, inStock: true, stock: 80, images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800'], specifications: { 'Pieces': '5', 'Levels': '5', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Laura N.', rating: 4, comment: 'Very versatile', date: '2024-01-14' }] },
  { id: 41, name: 'Basketball Official Size', price: 49.99, description: 'Official size basketball with excellent grip.', category: 'Sports', brand: 'CourtKing', rating: 4.6, reviewCount: 189, inStock: true, stock: 55, images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'], specifications: { 'Size': 'Official', 'Material': 'Rubber', 'Warranty': '6 months' }, reviews: [{ id: 1, user: 'Matt O.', rating: 5, comment: 'Great ball', date: '2024-01-13' }] },
  { id: 42, name: 'Cycling Helmet', price: 79.99, description: 'Safety cycling helmet with adjustable fit.', category: 'Sports', brand: 'SafeRide', rating: 4.5, reviewCount: 145, inStock: true, stock: 40, images: ['https://images.unsplash.com/photo-1557825835-70d97c4aa2b6?w=800'], specifications: { 'Size': 'Adjustable', 'Ventilation': '12 vents', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Nick P.', rating: 5, comment: 'Very safe and comfortable', date: '2024-01-12' }] },
  { id: 43, name: 'Gym Bag Duffel', price: 54.99, description: 'Spacious gym bag with shoe compartment.', category: 'Sports', brand: 'FitBag', rating: 4.3, reviewCount: 178, inStock: true, stock: 48, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800'], specifications: { 'Capacity': '40L', 'Compartments': '3', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Olivia Q.', rating: 4, comment: 'Fits everything', date: '2024-01-11' }] },
  { id: 44, name: 'Water Bottle 1L', price: 19.99, description: 'Insulated water bottle keeps drinks cold for 24 hours.', category: 'Sports', brand: 'HydroFit', rating: 4.7, reviewCount: 312, inStock: true, stock: 100, images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'], specifications: { 'Capacity': '1L', 'Insulated': 'Yes', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Pete R.', rating: 5, comment: 'Keeps water cold all day', date: '2024-01-10' }] },
  { id: 45, name: 'Jump Rope Speed', price: 14.99, description: 'Speed jump rope with ball bearings.', category: 'Sports', brand: 'SpeedFit', rating: 4.4, reviewCount: 201, inStock: true, stock: 90, images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800'], specifications: { 'Length': 'Adjustable', 'Bearings': 'Yes', 'Warranty': '6 months' }, reviews: [{ id: 1, user: 'Quinn S.', rating: 4, comment: 'Great for cardio', date: '2024-01-09' }] },
  { id: 46, name: 'Tennis Racket Pro', price: 149.99, description: 'Professional tennis racket with graphite frame.', category: 'Sports', brand: 'TennisPro', rating: 4.6, reviewCount: 89, inStock: true, stock: 25, images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800'], specifications: { 'Material': 'Graphite', 'Weight': '300g', 'Warranty': '2 years' }, reviews: [{ id: 1, user: 'Rita T.', rating: 5, comment: 'Perfect balance', date: '2024-01-08' }] },
  { id: 47, name: 'Soccer Ball FIFA', price: 39.99, description: 'FIFA approved soccer ball for official play.', category: 'Sports', brand: 'GoalMaster', rating: 4.5, reviewCount: 234, inStock: true, stock: 70, images: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'], specifications: { 'Size': '5', 'FIFA': 'Approved', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Steve U.', rating: 5, comment: 'Great quality ball', date: '2024-01-07' }] },
  { id: 48, name: 'Fitness Tracker Watch', price: 99.99, description: 'Fitness tracker with heart rate monitor and GPS.', category: 'Sports', brand: 'FitTrack', rating: 4.8, reviewCount: 289, inStock: true, stock: 45, images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800'], specifications: { 'GPS': 'Yes', 'Heart Rate': 'Yes', 'Battery': '7 days', 'Warranty': '1 year' }, reviews: [{ id: 1, user: 'Tina V.', rating: 5, comment: 'Tracks everything perfectly', date: '2024-01-06' }] },
]

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((state) => state.addItem)
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore()

  // Find product by ID from URL, fallback to first product if not found
  const product = mockProducts.find(p => p.id === parseInt(id)) || mockProducts[0]

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    alert('Product added to cart!')
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    navigate('/checkout')
  }

  const handleAddToWishlist = () => {
    addToWishlist(product)
    alert('Added to wishlist!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <Card padding={false} className="overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </Card>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Badge variant={product.inStock ? 'success' : 'danger'} className="mb-2">
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-primary-600 mb-6">
              ₵{product.price}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
                <span className="text-sm text-gray-600">({product.stock} available)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} variant="success" className="flex-1">
                Buy Now
              </Button>
              <button
                onClick={handleAddToWishlist}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 flex items-center justify-center"
              >
                <Heart size={24} className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>

            {/* Specifications */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b last:border-0">
                    <dt className="font-medium text-gray-600">{key}</dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-semibold text-primary-600">
                      {review.user[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{review.user}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProductDetailPage
