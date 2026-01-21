# Quick Start Guide

## Prerequisites

Before running this project, you need to install:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

## Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\LIFE GOES ON\Desktop\e comerce site"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to that URL

## Default Login Credentials (Mock Data)

### Regular User Account
- Email: `user@example.com`
- Password: `any password (6+ characters)`
- This will create a regular customer account

### Admin Account
- Email: `admin@example.com`
- Password: `any password (6+ characters)`
- This will create an admin account with access to the admin panel

**Note:** The current implementation uses mock authentication. Any email ending with "admin" will be given admin privileges.

## Project Features

### Customer Features ✅
- Browse products by category
- Search and filter products
- View product details with image gallery
- Add products to cart (persisted in localStorage)
- Add products to wishlist
- Complete checkout process (3-step flow)
- Submit custom product requests
- View order history
- Manage profile

### Admin Features ✅
- Admin dashboard with statistics
- Manage products (view list)
- Manage orders (view and update status)
- View custom requests
- Manage users

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── layout/        # Header, Footer, Layout
│   └── ui/            # Reusable UI components
├── pages/
│   ├── auth/          # Login, Register pages
│   ├── user/          # User dashboard, orders, profile
│   ├── admin/         # Admin panel pages
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   └── CheckoutPage.jsx
├── store/             # Zustand state management
│   ├── authStore.js   # Authentication state
│   ├── cartStore.js   # Shopping cart state
│   └── wishlistStore.js # Wishlist state
├── App.jsx
└── main.jsx
```

## Features Currently Using Mock Data

The following features use mock data and will need backend integration:

1. **Authentication** - Login/Register (stores in localStorage)
2. **Products** - All product data is hardcoded
3. **Orders** - Mock order history
4. **Reviews** - Mock product reviews
5. **Custom Requests** - Mock request submissions
6. **Payment Processing** - Simulated (no real charges)

## Next Steps for Production

1. **Set up Backend API:**
   - Create REST API using Node.js/Express
   - Implement all endpoints listed in README.md
   - Set up database (MongoDB or PostgreSQL)

2. **Connect Frontend to Backend:**
   - Update API calls to use real endpoints
   - Replace mock data with API responses
   - Implement proper error handling

3. **Payment Integration:**
   - Set up Stripe or PayPal account
   - Add payment gateway SDK
   - Implement secure payment processing

4. **Deploy:**
   - Frontend: Vercel/Netlify
   - Backend: AWS/Heroku/DigitalOcean
   - Database: MongoDB Atlas/AWS RDS

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically try the next available port (3001, 3002, etc.)

### Dependencies Not Installing
Try:
```bash
npm cache clean --force
npm install
```

### Build Errors
Make sure you have the latest Node.js version:
```bash
node --version  # Should be v18 or higher
```

## Support

For issues and questions:
- Check the main [README.md](README.md) for detailed documentation
- Review the requirements document: [ecommerce-requirements.md](../ecommerce-requirements.md)

## What's Working

✅ Full routing system
✅ Authentication (mock)
✅ Product browsing and filtering
✅ Shopping cart with persistence
✅ Wishlist functionality
✅ Checkout flow
✅ User dashboard
✅ Admin dashboard
✅ Custom request submission
✅ Responsive design
✅ State management with Zustand

## What Needs Backend Integration

❌ Real user authentication
❌ Real product data from database
❌ Order processing and tracking
❌ Payment gateway integration
❌ Email notifications
❌ File uploads (product images)
❌ Real-time updates
❌ Search functionality (full-text search)

Enjoy building your e-commerce platform! 🚀
