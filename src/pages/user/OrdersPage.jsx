import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Package } from 'lucide-react'

const mockOrders = [
  { id: 'ORD001', date: '2024-01-15', total: 299.99, status: 'delivered', items: 2 },
  { id: 'ORD002', date: '2024-01-10', total: 189.99, status: 'shipped', items: 1 },
  { id: 'ORD003', date: '2024-01-05', total: 449.99, status: 'processing', items: 3 },
]

const OrdersPage = () => {
  const getStatusVariant = (status) => {
    const variants = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      cancelled: 'danger',
    }
    return variants[status] || 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} hover className="cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.date} • {order.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600 mb-2">₵{order.total}</p>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
