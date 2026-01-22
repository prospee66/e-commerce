import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, Grid, List } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

// Mock products data
const mockProducts = [
  // Electronics
  { id: 1, name: 'Wireless Headphones Pro', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'electronics', rating: 4.5, inStock: true },
  { id: 2, name: 'Smart Watch Ultra', price: 399.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'electronics', rating: 4.8, inStock: true },
  { id: 9, name: 'Laptop 15" 16GB RAM', price: 1299.99, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', category: 'electronics', rating: 4.7, inStock: true },
  { id: 10, name: 'Wireless Mouse', price: 49.99, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', category: 'electronics', rating: 4.4, inStock: true },
  { id: 11, name: 'Mechanical Keyboard', price: 149.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', category: 'electronics', rating: 4.6, inStock: true },
  { id: 12, name: 'USB-C Hub 7-in-1', price: 69.99, image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', category: 'electronics', rating: 4.3, inStock: true },
  { id: 13, name: 'Bluetooth Speaker', price: 89.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', category: 'electronics', rating: 4.5, inStock: true },
  { id: 14, name: '4K Webcam', price: 179.99, image: 'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=500', category: 'electronics', rating: 4.7, inStock: false },
  { id: 15, name: 'Portable Charger 20000mAh', price: 59.99, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', category: 'electronics', rating: 4.6, inStock: true },
  { id: 16, name: 'Tablet 10" 128GB', price: 449.99, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500', category: 'electronics', rating: 4.5, inStock: true },
  { id: 17, name: 'Wireless Earbuds', price: 129.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', category: 'electronics', rating: 4.8, inStock: true },
  { id: 18, name: 'Gaming Headset RGB', price: 199.99, image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500', category: 'electronics', rating: 4.6, inStock: true },

  // Fashion
  { id: 3, name: 'Leather Backpack', price: 89.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'fashion', rating: 4.3, inStock: true },
  { id: 8, name: 'Designer Sunglasses', price: 159.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: 'fashion', rating: 4.5, inStock: true },
  { id: 19, name: 'Casual T-Shirt', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', category: 'fashion', rating: 4.2, inStock: true },
  { id: 20, name: 'Denim Jeans', price: 79.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', category: 'fashion', rating: 4.4, inStock: true },
  { id: 21, name: 'Leather Jacket', price: 249.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', category: 'fashion', rating: 4.7, inStock: true },
  { id: 22, name: 'Canvas Sneakers', price: 69.99, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500', category: 'fashion', rating: 4.3, inStock: true },
  { id: 23, name: 'Wool Scarf', price: 39.99, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500', category: 'fashion', rating: 4.5, inStock: true },
  { id: 24, name: 'Leather Belt', price: 49.99, image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500', category: 'fashion', rating: 4.4, inStock: true },
  { id: 25, name: 'Canvas Tote Bag', price: 44.99, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', category: 'fashion', rating: 4.2, inStock: true },
  { id: 26, name: 'Winter Coat', price: 189.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', category: 'fashion', rating: 4.6, inStock: false },
  { id: 27, name: 'Crossbody Bag', price: 64.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', category: 'fashion', rating: 4.5, inStock: true },
  { id: 28, name: 'Baseball Cap', price: 24.99, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', category: 'fashion', rating: 4.3, inStock: true },

  // Home & Garden
  { id: 5, name: 'Coffee Maker Deluxe', price: 79.99, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', category: 'home', rating: 4.4, inStock: true },
  { id: 7, name: 'Modern Desk Lamp', price: 49.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', category: 'home', rating: 4.2, inStock: true },
  { id: 29, name: 'Air Purifier HEPA', price: 199.99, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', category: 'home', rating: 4.6, inStock: true },
  { id: 30, name: 'Blender 1000W', price: 89.99, image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500', category: 'home', rating: 4.5, inStock: true },
  { id: 31, name: 'Ceramic Plant Pot Set', price: 34.99, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', category: 'home', rating: 4.4, inStock: true },
  { id: 32, name: 'Kitchen Knife Set', price: 129.99, image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500', category: 'home', rating: 4.7, inStock: true },
  { id: 33, name: 'Wall Clock Modern', price: 44.99, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500', category: 'home', rating: 4.3, inStock: true },
  { id: 34, name: 'Throw Pillow Set (4)', price: 54.99, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', category: 'home', rating: 4.5, inStock: true },
  { id: 35, name: 'Area Rug 5x7', price: 149.99, image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500', category: 'home', rating: 4.4, inStock: true },
  { id: 36, name: 'Garden Tool Set', price: 69.99, image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=500', category: 'home', rating: 4.6, inStock: true },
  { id: 37, name: 'Vacuum Cleaner Robot', price: 349.99, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500', category: 'home', rating: 4.7, inStock: false },
  { id: 38, name: 'Standing Fan 16"', price: 79.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', category: 'home', rating: 4.2, inStock: true },

  // Sports
  { id: 4, name: 'Running Shoes Pro', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'sports', rating: 4.6, inStock: true },
  { id: 6, name: 'Premium Yoga Mat', price: 39.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', category: 'sports', rating: 4.7, inStock: true },
  { id: 39, name: 'Dumbbell Set 20kg', price: 89.99, image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500', category: 'sports', rating: 4.5, inStock: true },
  { id: 40, name: 'Resistance Bands Set', price: 29.99, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', category: 'sports', rating: 4.4, inStock: true },
  { id: 41, name: 'Basketball Official Size', price: 49.99, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', category: 'sports', rating: 4.6, inStock: true },
  { id: 42, name: 'Cycling Helmet', price: 79.99, image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa2b6?w=500', category: 'sports', rating: 4.5, inStock: true },
  { id: 43, name: 'Gym Bag Duffel', price: 54.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'sports', rating: 4.3, inStock: true },
  { id: 44, name: 'Water Bottle 1L', price: 19.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', category: 'sports', rating: 4.7, inStock: true },
  { id: 45, name: 'Jump Rope Speed', price: 14.99, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', category: 'sports', rating: 4.4, inStock: true },
  { id: 46, name: 'Tennis Racket Pro', price: 149.99, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500', category: 'sports', rating: 4.6, inStock: true },
  { id: 47, name: 'Soccer Ball FIFA', price: 39.99, image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500', category: 'sports', rating: 4.5, inStock: true },
  { id: 48, name: 'Fitness Tracker Watch', price: 99.99, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500', category: 'sports', rating: 4.8, inStock: true },
]

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(mockProducts)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  })

  // Update filters when URL parameters change
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || ''
    const searchFromUrl = searchParams.get('search') || ''

    setFilters(prev => ({
      ...prev,
      category: categoryFromUrl,
      search: searchFromUrl,
    }))
  }, [searchParams])

  useEffect(() => {
    let filtered = mockProducts

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice))
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock)
    }

    setProducts(filtered)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Get category name for display
  const getCategoryName = () => {
    const categoryMap = {
      electronics: 'Electronics',
      fashion: 'Fashion',
      home: 'Home & Garden',
      sports: 'Sports',
    }
    return categoryMap[filters.category] || 'All Products'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{getCategoryName()}</h1>
          <p className="text-gray-600">
            Showing {products.length} of {mockProducts.length} products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Category</h3>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                fullWidth
                onClick={() => setFilters({
                  category: '',
                  search: '',
                  minPrice: '',
                  maxPrice: '',
                  inStock: false,
                })}
              >
                Clear Filters
              </Button>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>

              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Newest</option>
              </select>
            </div>

            {/* Products */}
            {products.length === 0 ? (
              <Card className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </Card>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {products.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <Card className={`overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`} padding={false}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={viewMode === 'list' ? 'w-48 h-48 object-cover' : 'w-full h-64 object-cover'}
                      />
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={product.inStock ? 'success' : 'danger'}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary-600">
                            ₵{product.price}
                          </span>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
