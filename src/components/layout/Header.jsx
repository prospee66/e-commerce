import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Heart, Search, Menu, X, LogOut, ChevronRight, Phone } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useWishlistStore from '../../store/wishlistStore'
import api from '../../lib/api'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on any route change (pathname or query params)
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname, location.search])

  const { isAuthenticated, user, logout, isAdmin } = useAuthStore()

  // Programmatic navigation for drawer - flushSync forces React to update DOM
  // synchronously before navigate, bypassing React 18 automatic batching
  const drawerNavigate = useCallback((path) => {
    flushSync(() => {
      setDrawerOpen(false)
    })
    // Small delay ensures the drawer is fully removed from DOM before navigation
    setTimeout(() => navigate(path), 10)
  }, [navigate])
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

  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get('/categories').then(res => {
      const cats = res.data?.categories || []
      setCategories([
        { label: 'All Products', path: '/products' },
        ...cats.map(c => ({ label: c.name, path: `/products?category=${c.slug}` })),
        { label: 'Custom Request', path: '/custom-requests' },
      ])
    }).catch(() => {
      setCategories([
        { label: 'All Products', path: '/products' },
        { label: 'Custom Request', path: '/custom-requests' },
      ])
    })
  }, [])

  return (
    <>
      {/* Layer 1: Promo Banner */}
      <div className="bg-primary-800 text-white text-center py-1.5 px-4">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
          <Phone size={14} className="hidden sm:block" />
          <span>Call to Order: <a href="tel:0302740642" className="font-semibold underline">030 274 0642</a></span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Free Shipping on orders over GH₵100</span>
        </div>
      </div>

      {/* Sticky wrapper for header + search + nav */}
      <div className="sticky top-0 z-40">
        {/* Layer 2: Main Header Bar */}
        <header className="bg-white shadow-sm">
          <div className="container-custom">
            <div className="flex items-center justify-between py-2.5">
              {/* Left: Hamburger */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-gray-700 hover:text-primary-600 p-1"
                aria-label="Open menu"
              >
                <Menu size={26} />
              </button>

              {/* Center: Logo */}
              <Link to="/" className="text-xl sm:text-2xl font-bold text-primary-600 tracking-tight">
                Life Goes On Hub
              </Link>

              {/* Right: Icons */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/wishlist" className="relative hidden sm:block">
                      <Heart size={22} className="text-gray-700 hover:text-primary-600 transition-colors" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {/* Desktop Account Dropdown */}
                    <div className="relative group hidden md:block">
                      <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600">
                        <User size={22} />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                        <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Orders</Link>
                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                        {isAdmin() && (
                          <>
                            <hr className="my-1" />
                            <Link to="/admin" className="block px-4 py-2 text-primary-600 hover:bg-gray-100 font-medium">Admin Panel</Link>
                          </>
                        )}
                        <hr className="my-1" />
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>

                    {/* Mobile Account */}
                    <Link to="/dashboard" className="md:hidden text-gray-700 hover:text-primary-600">
                      <User size={22} />
                    </Link>
                  </>
                ) : (
                  <Link to="/login" className="text-gray-700 hover:text-primary-600">
                    <User size={22} />
                  </Link>
                )}

                <Link to="/cart" className="relative">
                  <ShoppingCart size={22} className="text-gray-700 hover:text-primary-600 transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Layer 3: Search Bar */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="container-custom py-2">
            <form onSubmit={handleSearch} className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands and categories"
                className="w-full pl-10 pr-20 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Layer 4: Desktop Navigation */}
        <nav className="hidden md:block bg-white border-b border-gray-200">
          <div className="container-custom">
            <div className="flex items-center gap-1 py-2 overflow-x-auto">
              {categories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors whitespace-nowrap"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 overflow-y-auto">
            {/* Drawer Header */}
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <div>
                {isAuthenticated ? (
                  <div>
                    <p className="font-semibold">{user?.name || 'Welcome'}</p>
                    <p className="text-xs text-primary-100">{user?.email}</p>
                  </div>
                ) : (
                  <button onClick={() => drawerNavigate('/login')} className="font-semibold text-white">
                    Sign In / Register
                  </button>
                )}
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-white hover:text-primary-200">
                <X size={24} />
              </button>
            </div>

            {/* Categories */}
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
              {categories.map((cat) => (
                <button
                  key={cat.path}
                  onClick={() => drawerNavigate(cat.path)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <span>{cat.label}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>

            {/* Account Links */}
            {isAuthenticated && (
              <div className="border-t py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">My Account</p>
                <button onClick={() => drawerNavigate('/dashboard')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                  <span>Dashboard</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => drawerNavigate('/orders')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                  <span>My Orders</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => drawerNavigate('/wishlist')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                  <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => drawerNavigate('/profile')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                  <span>Profile</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                {isAdmin() && (
                  <button onClick={() => drawerNavigate('/admin')} className="w-full flex items-center justify-between px-4 py-3 text-primary-600 font-medium hover:bg-gray-50 active:bg-gray-100 text-left">
                    <span>Admin Panel</span>
                    <ChevronRight size={16} className="text-primary-400" />
                  </button>
                )}
              </div>
            )}

            {/* Help & Logout */}
            <div className="border-t py-2">
              <button onClick={() => drawerNavigate('/help')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                <span>Help Center</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button onClick={() => drawerNavigate('/track-order')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                <span>Track Order</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => { flushSync(() => setDrawerOpen(false)); handleLogout() }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-gray-50 active:bg-gray-100"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
