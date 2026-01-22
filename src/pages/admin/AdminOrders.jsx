import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const mockOrders = [
  { id: 'ORD001', customer: 'John Doe', date: '2024-01-15', total: 299.99, status: 'delivered' },
  { id: 'ORD002', customer: 'Jane Smith', date: '2024-01-14', total: 189.99, status: 'shipped' },
  { id: 'ORD003', customer: 'Bob Johnson', date: '2024-01-13', total: 449.99, status: 'processing' },
]

const AdminOrders = () => {
  const getStatusVariant = (status) => {
    const variants = { delivered: 'success', shipped: 'info', processing: 'warning', cancelled: 'danger' }
    return variants[status] || 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">₵{order.total}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-primary-600 hover:text-primary-700">
                        View Details
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

export default AdminOrders
