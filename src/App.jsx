import { Routes, Route } from 'react-router-dom'
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
import NotFoundPage from './pages/NotFoundPage'
import PrivateRoute from './components/auth/PrivateRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {
  return (
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

        {/* Admin routes */}
        <Route path="admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="admin/products" element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        } />
        <Route path="admin/orders" element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        } />
        <Route path="admin/requests" element={
          <AdminRoute>
            <AdminRequests />
          </AdminRoute>
        } />
        <Route path="admin/users" element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
