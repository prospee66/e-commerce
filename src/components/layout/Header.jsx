import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Heart, Search, Menu, LogOut } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useWishlistStore from '../../store/wishlistStore'
import Button from '../ui/Button'

const Header = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { isAuthenticated, user, logout, isAdmin } = useAuthStore()
  const itemCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.items.length)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container-custom">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Life Goes On Hub
          </Link>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="relative hidden sm:block">
                  <Heart size={24} className="text-gray-700 hover:text-primary-600 transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="relative">
                  <ShoppingCart size={24} className="text-gray-700 hover:text-primary-600 transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                    <User size={24} />
                    <span className="hidden lg:block">{user?.name || 'Account'}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <Link to="/custom-requests" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Custom Requests
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    {isAdmin() && (
                      <>
                        <hr className="my-2" />
                        <Link to="/admin" className="block px-4 py-2 text-primary-600 hover:bg-gray-100">
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/cart" className="relative">
                  <ShoppingCart size={24} className="text-gray-700 hover:text-primary-600 transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Navigation - Always visible on desktop */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 py-3 border-t overflow-x-auto">
          <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap font-medium">
            All Products
          </Link>
          <Link to="/products?category=electronics" className="text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap font-medium">
            Electronics
          </Link>
          <Link to="/products?category=fashion" className="text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap font-medium">
            Fashion
          </Link>
          <Link to="/products?category=home" className="text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap font-medium">
            Home & Garden
          </Link>
          <Link to="/products?category=sports" className="text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap font-medium">
            Sports
          </Link>
          <Link to="/custom-requests" className="text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap font-medium">
            Custom Request
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-primary-600"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Mobile nav links */}
            <div className="flex flex-col gap-2">
              <Link to="/products" className="py-2 text-gray-700 hover:text-primary-600">
                All Products
              </Link>
              <Link to="/products?category=electronics" className="py-2 text-gray-700 hover:text-primary-600">
                Electronics
              </Link>
              <Link to="/products?category=fashion" className="py-2 text-gray-700 hover:text-primary-600">
                Fashion
              </Link>
              <Link to="/products?category=home" className="py-2 text-gray-700 hover:text-primary-600">
                Home & Garden
              </Link>
              <Link to="/products?category=sports" className="py-2 text-gray-700 hover:text-primary-600">
                Sports
              </Link>
              {isAuthenticated && (
                <>
                  <hr className="my-2" />
                  <Link to="/dashboard" className="py-2 text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                  <Link to="/orders" className="py-2 text-gray-700 hover:text-primary-600">
                    My Orders
                  </Link>
                  <Link to="/wishlist" className="py-2 text-gray-700 hover:text-primary-600">
                    Wishlist
                  </Link>
                  <Link to="/custom-requests" className="py-2 text-gray-700 hover:text-primary-600">
                    Custom Requests
                  </Link>
                  <Link to="/profile" className="py-2 text-gray-700 hover:text-primary-600">
                    Profile
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className="py-2 text-primary-600 hover:text-primary-700">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="py-2 text-left text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
