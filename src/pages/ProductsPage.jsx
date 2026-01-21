import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, Grid, List } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

// Mock products data
const mockProducts = [
  { id: 1, name: 'Wireless Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'electronics', rating: 4.5, inStock: true },
  { id: 2, name: 'Smart Watch', price: 399.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'electronics', rating: 4.8, inStock: true },
  { id: 3, name: 'Leather Backpack', price: 89.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'fashion', rating: 4.3, inStock: true },
  { id: 4, name: 'Running Shoes', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'sports', rating: 4.6, inStock: false },
  { id: 5, name: 'Coffee Maker', price: 79.99, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', category: 'home', rating: 4.4, inStock: true },
  { id: 6, name: 'Yoga Mat', price: 39.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', category: 'sports', rating: 4.7, inStock: true },
  { id: 7, name: 'Desk Lamp', price: 49.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', category: 'home', rating: 4.2, inStock: true },
  { id: 8, name: 'Sunglasses', price: 159.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: 'fashion', rating: 4.5, inStock: true },
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
                            ${product.price}
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
