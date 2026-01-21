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
    name: 'Sunglasses',
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
              ${product.price}
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
