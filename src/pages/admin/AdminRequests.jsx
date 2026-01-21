import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const mockRequests = [
  { id: 1, customer: 'John Doe', title: 'Custom Laptop Configuration', date: '2024-01-15', budget: '₵2000-₵2500', status: 'pending' },
  { id: 2, customer: 'Jane Smith', title: 'Bulk Order - Office Supplies', date: '2024-01-10', budget: '₵5000+', status: 'approved' },
]

const AdminRequests = () => {
  const getStatusVariant = (status) => {
    const variants = { pending: 'warning', approved: 'success', rejected: 'danger', 'in-review': 'info' }
    return variants[status] || 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Custom Requests</h1>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Budget</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockRequests.map((request) => (
                  <tr key={request.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{request.id}</td>
                    <td className="py-3 px-4">{request.customer}</td>
                    <td className="py-3 px-4">{request.title}</td>
                    <td className="py-3 px-4">{request.budget}</td>
                    <td className="py-3 px-4">{request.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusVariant(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="outline">Review</Button>
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

export default AdminRequests
