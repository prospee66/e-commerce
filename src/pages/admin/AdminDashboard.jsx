import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, FileText, DollarSign, TrendingUp } from 'lucide-react'
import Card from '../../components/ui/Card'

const AdminDashboard = () => {
  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: '₵24,500', change: '+12.5%', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: ShoppingBag, label: 'Total Orders', value: '342', change: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Users, label: 'Total Users', value: '1,243', change: '+15.3%', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Package, label: 'Products', value: '156', change: '+4', color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  const menuItems = [
    { icon: Package, label: 'Manage Products', path: '/admin/products', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: ShoppingBag, label: 'Manage Orders', path: '/admin/orders', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: FileText, label: 'Custom Requests', path: '/admin/requests', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Users, label: 'Manage Users', path: '/admin/users', color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Card hover className="text-center cursor-pointer transition-transform hover:scale-105">
                <div className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <item.icon size={32} className={item.color} />
                </div>
                <h3 className="font-semibold text-lg">{item.label}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
