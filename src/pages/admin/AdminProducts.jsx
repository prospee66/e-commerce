import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Plus, Edit, Trash2 } from 'lucide-react'

const mockProducts = [
  // Electronics
  { id: 1, name: 'Wireless Headphones Pro', price: 299.99, category: 'Electronics', stock: 15, status: 'active' },
  { id: 2, name: 'Smart Watch Ultra', price: 399.99, category: 'Electronics', stock: 8, status: 'active' },
  { id: 9, name: 'Laptop 15" 16GB RAM', price: 1299.99, category: 'Electronics', stock: 10, status: 'active' },
  { id: 10, name: 'Wireless Mouse', price: 49.99, category: 'Electronics', stock: 45, status: 'active' },
  { id: 11, name: 'Mechanical Keyboard', price: 149.99, category: 'Electronics', stock: 28, status: 'active' },
  { id: 12, name: 'USB-C Hub 7-in-1', price: 69.99, category: 'Electronics', stock: 40, status: 'active' },
  { id: 13, name: 'Bluetooth Speaker', price: 89.99, category: 'Electronics', stock: 32, status: 'active' },
  { id: 14, name: '4K Webcam', price: 179.99, category: 'Electronics', stock: 0, status: 'out_of_stock' },
  { id: 15, name: 'Portable Charger 20000mAh', price: 59.99, category: 'Electronics', stock: 55, status: 'active' },
  { id: 16, name: 'Tablet 10" 128GB', price: 449.99, category: 'Electronics', stock: 18, status: 'active' },
  { id: 17, name: 'Wireless Earbuds', price: 129.99, category: 'Electronics', stock: 42, status: 'active' },
  { id: 18, name: 'Gaming Headset RGB', price: 199.99, category: 'Electronics', stock: 25, status: 'active' },
  // Fashion
  { id: 3, name: 'Leather Backpack', price: 89.99, category: 'Fashion', stock: 20, status: 'active' },
  { id: 8, name: 'Designer Sunglasses', price: 159.99, category: 'Fashion', stock: 22, status: 'active' },
  { id: 19, name: 'Casual T-Shirt', price: 29.99, category: 'Fashion', stock: 150, status: 'active' },
  { id: 20, name: 'Denim Jeans', price: 79.99, category: 'Fashion', stock: 80, status: 'active' },
  { id: 21, name: 'Leather Jacket', price: 249.99, category: 'Fashion', stock: 15, status: 'active' },
  { id: 22, name: 'Canvas Sneakers', price: 69.99, category: 'Fashion', stock: 95, status: 'active' },
  { id: 23, name: 'Wool Scarf', price: 39.99, category: 'Fashion', stock: 60, status: 'active' },
  { id: 24, name: 'Leather Belt', price: 49.99, category: 'Fashion', stock: 70, status: 'active' },
  { id: 25, name: 'Canvas Tote Bag', price: 44.99, category: 'Fashion', stock: 100, status: 'active' },
  { id: 26, name: 'Winter Coat', price: 189.99, category: 'Fashion', stock: 0, status: 'out_of_stock' },
  { id: 27, name: 'Crossbody Bag', price: 64.99, category: 'Fashion', stock: 45, status: 'active' },
  { id: 28, name: 'Baseball Cap', price: 24.99, category: 'Fashion', stock: 120, status: 'active' },
  // Home & Garden
  { id: 5, name: 'Coffee Maker Deluxe', price: 79.99, category: 'Home & Garden', stock: 12, status: 'active' },
  { id: 7, name: 'Modern Desk Lamp', price: 49.99, category: 'Home & Garden', stock: 18, status: 'active' },
  { id: 29, name: 'Air Purifier HEPA', price: 199.99, category: 'Home & Garden', stock: 22, status: 'active' },
  { id: 30, name: 'Blender 1000W', price: 89.99, category: 'Home & Garden', stock: 38, status: 'active' },
  { id: 31, name: 'Ceramic Plant Pot Set', price: 34.99, category: 'Home & Garden', stock: 75, status: 'active' },
  { id: 32, name: 'Kitchen Knife Set', price: 129.99, category: 'Home & Garden', stock: 28, status: 'active' },
  { id: 33, name: 'Wall Clock Modern', price: 44.99, category: 'Home & Garden', stock: 50, status: 'active' },
  { id: 34, name: 'Throw Pillow Set (4)', price: 54.99, category: 'Home & Garden', stock: 65, status: 'active' },
  { id: 35, name: 'Area Rug 5x7', price: 149.99, category: 'Home & Garden', stock: 20, status: 'active' },
  { id: 36, name: 'Garden Tool Set', price: 69.99, category: 'Home & Garden', stock: 42, status: 'active' },
  { id: 37, name: 'Vacuum Cleaner Robot', price: 349.99, category: 'Home & Garden', stock: 0, status: 'out_of_stock' },
  { id: 38, name: 'Standing Fan 16"', price: 79.99, category: 'Home & Garden', stock: 35, status: 'active' },
  // Sports
  { id: 4, name: 'Running Shoes Pro', price: 129.99, category: 'Sports', stock: 25, status: 'active' },
  { id: 6, name: 'Premium Yoga Mat', price: 39.99, category: 'Sports', stock: 35, status: 'active' },
  { id: 39, name: 'Dumbbell Set 20kg', price: 89.99, category: 'Sports', stock: 30, status: 'active' },
  { id: 40, name: 'Resistance Bands Set', price: 29.99, category: 'Sports', stock: 80, status: 'active' },
  { id: 41, name: 'Basketball Official Size', price: 49.99, category: 'Sports', stock: 55, status: 'active' },
  { id: 42, name: 'Cycling Helmet', price: 79.99, category: 'Sports', stock: 40, status: 'active' },
  { id: 43, name: 'Gym Bag Duffel', price: 54.99, category: 'Sports', stock: 48, status: 'active' },
  { id: 44, name: 'Water Bottle 1L', price: 19.99, category: 'Sports', stock: 100, status: 'active' },
  { id: 45, name: 'Jump Rope Speed', price: 14.99, category: 'Sports', stock: 90, status: 'active' },
  { id: 46, name: 'Tennis Racket Pro', price: 149.99, category: 'Sports', stock: 25, status: 'active' },
  { id: 47, name: 'Soccer Ball FIFA', price: 39.99, category: 'Sports', stock: 70, status: 'active' },
  { id: 48, name: 'Fitness Tracker Watch', price: 99.99, category: 'Sports', stock: 45, status: 'active' },
]

const AdminProducts = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <Button>
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">₵{product.price}</td>
                    <td className="py-3 px-4">{product.stock}</td>
                    <td className="py-3 px-4">
                      <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                        {product.stock > 0 ? 'Active' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-blue-600 hover:text-blue-700 mr-3">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminProducts
