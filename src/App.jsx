import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import useAuthStore from './store/authStore'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import UserDashboard from './pages/user/UserDashboard'
import OrdersPage from './pages/user/OrdersPage'
import ProfilePage from './pages/user/ProfilePage'
import WishlistPage from './pages/user/WishlistPage'
import CustomRequestsPage from './pages/user/CustomRequestsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminRequests from './pages/admin/AdminRequests'
import AdminUsers from './pages/admin/AdminUsers'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HelpPage from './pages/HelpPage'
import TrackOrderPage from './pages/TrackOrderPage'
import ReturnsPage from './pages/ReturnsPage'
import ShippingPage from './pages/ShippingPage'
import FAQPage from './pages/FAQPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import CookiesPage from './pages/CookiesPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivateRoute from './components/auth/PrivateRoute'
import AdminRoute from './components/auth/AdminRoute'
import AdminLayout from './components/layout/AdminLayout'
import ScrollToTop from './components/layout/ScrollToTop'

function App() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [])

  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected user routes */}
        <Route path="checkout" element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        } />
        <Route path="dashboard" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="orders" element={
          <PrivateRoute>
            <OrdersPage />
          </PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="wishlist" element={
          <PrivateRoute>
            <WishlistPage />
          </PrivateRoute>
        } />

        {/* Custom requests - Public route (anyone can submit) */}
        <Route path="custom-requests" element={<CustomRequestsPage />} />

        {/* Info pages - Public routes */}
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="track-order" element={<TrackOrderPage />} />
        <Route path="returns" element={<ReturnsPage />} />
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="cookies" element={<CookiesPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin routes with dedicated layout */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
