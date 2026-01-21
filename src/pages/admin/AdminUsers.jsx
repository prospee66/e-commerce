import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joined: '2024-01-10' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', status: 'active', joined: '2024-01-08' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', joined: '2023-12-01' },
]

const AdminUsers = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success">{user.status.toUpperCase()}</Badge>
                    </td>
                    <td className="py-3 px-4">{user.joined}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-primary-600 hover:text-primary-700">
                        Edit
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

export default AdminUsers
