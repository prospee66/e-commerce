import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Plus, Edit, Trash2 } from 'lucide-react'

const mockProducts = [
  { id: 1, name: 'Wireless Headphones', price: 299.99, category: 'Electronics', stock: 15, status: 'active' },
  { id: 2, name: 'Smart Watch', price: 399.99, category: 'Electronics', stock: 8, status: 'active' },
  { id: 3, name: 'Leather Backpack', price: 89.99, category: 'Fashion', stock: 0, status: 'out_of_stock' },
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
                    <td className="py-3 px-4">${product.price}</td>
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
