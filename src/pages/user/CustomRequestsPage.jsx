import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { FileText, Send } from 'lucide-react'

const mockRequests = [
  { id: 1, title: 'Custom Laptop Configuration', status: 'pending', date: '2024-01-15', budget: '₵2000-₵2500' },
  { id: 2, title: 'Bulk Order - Office Supplies', status: 'approved', date: '2024-01-10', budget: '₵5000+' },
]

const CustomRequestsPage = () => {
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data) => {
    console.log('Request submitted:', data)
    alert('Custom request submitted successfully!')
    reset()
    setShowForm(false)
  }

  const getStatusVariant = (status) => {
    const variants = { pending: 'warning', approved: 'success', rejected: 'danger', 'in-review': 'info' }
    return variants[status] || 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Custom Requests</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Send size={20} className="mr-2" />
            New Request
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Submit Custom Request</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Request Title" {...register('title', { required: true })} />
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register('description', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                  placeholder="Describe what you're looking for..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantity" type="number" {...register('quantity')} />
                <Input label="Budget Range" placeholder="e.g., ₵500-₵1000" {...register('budget')} />
              </div>
              <Input label="Preferred Delivery Date" type="date" {...register('deliveryDate')} />
              <div className="flex gap-4">
                <Button type="submit">Submit Request</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Requests</h2>
          {mockRequests.map((request) => (
            <Card key={request.id} hover className="cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{request.title}</h3>
                    <p className="text-sm text-gray-600">{request.date} • Budget: {request.budget}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(request.status)}>
                  {request.status.toUpperCase()}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomRequestsPage
