import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { usePaystackPayment } from 'react-paystack'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import useCartStore from '../store/cartStore'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [customerData, setCustomerData] = useState(null)
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Paystack configuration
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: customerData?.email || '',
    amount: Math.round(getTotal() * 100), // Amount in pesewas (100 pesewas = 1 GHS)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here',
    currency: 'GHS',
    channels: paymentMethod === 'momo'
      ? ['mobile_money']
      : paymentMethod === 'card'
      ? ['card']
      : ['card', 'mobile_money'],
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: customerData?.name || 'N/A',
        },
        {
          display_name: 'Phone Number',
          variable_name: 'phone_number',
          value: customerData?.phone || 'N/A',
        },
        {
          display_name: 'Cart Items',
          variable_name: 'cart_items',
          value: items.length.toString(),
        },
      ],
    },
  }

  const initializePayment = usePaystackPayment(paystackConfig)

  // Handle payment success
  const onPaymentSuccess = (reference) => {
    console.log('Payment successful!', reference)
    alert('Payment successful! Order ID: ' + reference.reference)
    clearCart()
    navigate('/orders')
  }

  // Handle payment close
  const onPaymentClose = () => {
    console.log('Payment popup closed')
    alert('Payment cancelled. Please try again.')
  }

  const onSubmit = (data) => {
    if (step === 1) {
      // Save customer data and move to next step
      setCustomerData(data)
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      // Initiate Paystack payment
      if (paymentMethod === 'paypal') {
        // For PayPal, show a message (Paystack doesn't support PayPal directly)
        alert('PayPal integration coming soon! Please use Card or Mobile Money.')
      } else {
        initializePayment(onPaymentSuccess, onPaymentClose)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex mb-8">
          {['Payment & Shipping', 'Payment Details', 'Review'].map((label, index) => (
            <div key={label} className="flex-1 flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-primary-600' : 'bg-gray-300'
              } text-white font-semibold`}>
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span className="ml-2 font-medium">{label}</span>
              {index < 2 && <div className="flex-1 h-1 bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-semibold mb-6">Choose Payment Method</h2>

                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'card' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-gray-300 hover:border-primary-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="5" width="20" height="14" rx="2" stroke={paymentMethod === 'card' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                            <path d="M2 10H22" stroke={paymentMethod === 'card' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                            <rect x="5" y="14" width="4" height="2" rx="0.5" fill={paymentMethod === 'card' ? '#2563eb' : '#6b7280'}/>
                            <rect x="10" y="14" width="4" height="2" rx="0.5" fill={paymentMethod === 'card' ? '#2563eb' : '#6b7280'}/>
                          </svg>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">Credit/Debit Card</div>
                        <div className="flex justify-center gap-1 mt-2">
                          <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#EB001B"/>
                            <circle cx="20" cy="16" r="10" fill="#FF5F00"/>
                            <circle cx="28" cy="16" r="10" fill="#F79E1B"/>
                          </svg>
                          <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#0066B2"/>
                            <rect x="8" y="11" width="10" height="10" fill="white"/>
                            <rect x="30" y="11" width="10" height="10" fill="#FFA500"/>
                          </svg>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'momo' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-gray-300 hover:border-primary-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="2" width="14" height="20" rx="2" stroke={paymentMethod === 'momo' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                            <path d="M9 18H15" stroke={paymentMethod === 'momo' ? '#2563eb' : '#6b7280'} strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="9" r="3" stroke={paymentMethod === 'momo' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                            <path d="M15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14" stroke={paymentMethod === 'momo' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">Mobile Money</div>
                        <div className="text-xs text-gray-500 mt-1">MTN • Vodafone • AirtelTigo</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'paypal' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-gray-300 hover:border-primary-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 20L9.5 14H6L7 8C7 5.79086 8.79086 4 11 4H14C16.7614 4 19 6.23858 19 9C19 11.7614 16.7614 14 14 14H11L10 20H8.5Z" fill={paymentMethod === 'paypal' ? '#0070BA' : '#6b7280'}/>
                            <path d="M9 15H6L7.5 7C7.5 5.61929 8.61929 4.5 10 4.5H13C15.4853 4.5 17.5 6.51472 17.5 9C17.5 11.4853 15.4853 13.5 13 13.5H10L9 15Z" fill={paymentMethod === 'paypal' ? '#003087' : '#4b5563'}/>
                          </svg>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">PayPal</div>
                        <div className="text-xs text-gray-500 mt-1">Fast & secure</div>
                      </button>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <svg className="w-6 h-6 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                            <rect x="5" y="14" width="4" height="2" rx="0.5" fill="currentColor"/>
                            <rect x="10" y="14" width="4" height="2" rx="0.5" fill="currentColor"/>
                          </svg>
                          Credit/Debit Card Details
                        </h3>
                        <Input
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          {...register('cardNumber', { required: paymentMethod === 'card' })}
                          error={errors.cardNumber && 'Card number is required'}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            placeholder="MM/YY"
                            {...register('expiry', { required: paymentMethod === 'card' })}
                            error={errors.expiry && 'Expiry date is required'}
                          />
                          <Input
                            label="CVV"
                            placeholder="123"
                            {...register('cvv', { required: paymentMethod === 'card' })}
                            error={errors.cvv && 'CVV is required'}
                          />
                        </div>
                        <Input
                          label="Cardholder Name"
                          {...register('cardHolder', { required: paymentMethod === 'card' })}
                          error={errors.cardHolder && 'Cardholder name is required'}
                        />
                      </div>
                    )}

                    {/* Mobile Money Form */}
                    {paymentMethod === 'momo' && (
                      <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <svg className="w-6 h-6 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Mobile Money Details
                        </h3>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Select Provider</label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-all"
                            >
                              <div className="font-semibold text-yellow-600">MTN</div>
                            </button>
                            <button
                              type="button"
                              className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-all"
                            >
                              <div className="font-semibold text-red-600">Vodafone</div>
                            </button>
                            <button
                              type="button"
                              className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-all"
                            >
                              <div className="font-semibold text-blue-600">AirtelTigo</div>
                            </button>
                          </div>
                        </div>
                        <Input
                          label="Mobile Money Number"
                          placeholder="0XX XXX XXXX"
                          {...register('momoNumber', { required: paymentMethod === 'momo' })}
                          error={errors.momoNumber && 'Mobile money number is required'}
                        />
                        <Input
                          label="Account Name"
                          placeholder="John Doe"
                          {...register('momoName', { required: paymentMethod === 'momo' })}
                          error={errors.momoName && 'Account name is required'}
                        />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                          <strong>Note:</strong> You will receive a prompt on your phone to authorize the payment.
                        </div>
                      </div>
                    )}

                    {/* PayPal Form */}
                    {paymentMethod === 'paypal' && (
                      <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 20L9.5 14H6L7 8C7 5.79086 8.79086 4 11 4H14C16.7614 4 19 6.23858 19 9C19 11.7614 16.7614 14 14 14H11L10 20H8.5Z" fill="#0070BA"/>
                            <path d="M9 15H6L7.5 7C7.5 5.61929 8.61929 4.5 10 4.5H13C15.4853 4.5 17.5 6.51472 17.5 9C17.5 11.4853 15.4853 13.5 13 13.5H10L9 15Z" fill="#003087"/>
                          </svg>
                          PayPal Payment
                        </h3>
                        <Input
                          label="PayPal Email"
                          type="email"
                          placeholder="your@email.com"
                          {...register('paypalEmail', { required: paymentMethod === 'paypal' })}
                          error={errors.paypalEmail && 'PayPal email is required'}
                        />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                          <strong>Note:</strong> You will be redirected to PayPal to complete the payment securely.
                        </div>
                      </div>
                    )}

                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                      <Input label="Full Name" {...register('name', { required: true })} error={errors.name && 'Name is required'} />
                      <Input label="Email" type="email" {...register('email', { required: true })} error={errors.email && 'Email is required'} />
                      <Input label="Phone" {...register('phone', { required: true })} error={errors.phone && 'Phone is required'} />
                      <Input label="Address" {...register('address', { required: true })} error={errors.address && 'Address is required'} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="City" {...register('city', { required: true })} error={errors.city && 'City is required'} />
                        {(paymentMethod === 'card' || paymentMethod === 'paypal') && (
                          <Input label="Postal Code" {...register('postalCode', { required: paymentMethod === 'card' || paymentMethod === 'paypal' })} error={errors.postalCode && 'Postal code is required'} />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'card' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-gray-300 hover:border-primary-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="5" width="20" height="14" rx="2" stroke={paymentMethod === 'card' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                            <path d="M2 10H22" stroke={paymentMethod === 'card' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                            <rect x="5" y="14" width="4" height="2" rx="0.5" fill={paymentMethod === 'card' ? '#2563eb' : '#6b7280'}/>
                            <rect x="10" y="14" width="4" height="2" rx="0.5" fill={paymentMethod === 'card' ? '#2563eb' : '#6b7280'}/>
                          </svg>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">Credit/Debit Card</div>
                        <div className="flex justify-center gap-1 mt-2">
                          <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#EB001B"/>
                            <circle cx="20" cy="16" r="10" fill="#FF5F00"/>
                            <circle cx="28" cy="16" r="10" fill="#F79E1B"/>
                          </svg>
                          <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#0066B2"/>
                            <rect x="8" y="11" width="10" height="10" fill="white"/>
                            <rect x="30" y="11" width="10" height="10" fill="#FFA500"/>
                          </svg>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'momo' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-gray-300 hover:border-primary-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="2" width="14" height="20" rx="2" stroke={paymentMethod === 'momo' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                            <path d="M9 18H15" stroke={paymentMethod === 'momo' ? '#2563eb' : '#6b7280'} strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="9" r="3" stroke={paymentMethod === 'momo' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                            <path d="M15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14" stroke={paymentMethod === 'momo' ? '#2563eb' : '#6b7280'} strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">Mobile Money</div>
                        <div className="text-xs text-gray-500 mt-1">MTN • Vodafone • AirtelTigo</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'paypal' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-gray-300 hover:border-primary-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 20L9.5 14H6L7 8C7 5.79086 8.79086 4 11 4H14C16.7614 4 19 6.23858 19 9C19 11.7614 16.7614 14 14 14H11L10 20H8.5Z" fill={paymentMethod === 'paypal' ? '#0070BA' : '#6b7280'}/>
                            <path d="M9 15H6L7.5 7C7.5 5.61929 8.61929 4.5 10 4.5H13C15.4853 4.5 17.5 6.51472 17.5 9C17.5 11.4853 15.4853 13.5 13 13.5H10L9 15Z" fill={paymentMethod === 'paypal' ? '#003087' : '#4b5563'}/>
                          </svg>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">PayPal</div>
                        <div className="text-xs text-gray-500 mt-1">Fast & secure</div>
                      </button>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">Credit/Debit Card Details</h3>
                        <Input
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          {...register('cardNumber', { required: paymentMethod === 'card' })}
                          error={errors.cardNumber && 'Card number is required'}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            placeholder="MM/YY"
                            {...register('expiry', { required: paymentMethod === 'card' })}
                            error={errors.expiry && 'Expiry date is required'}
                          />
                          <Input
                            label="CVV"
                            placeholder="123"
                            {...register('cvv', { required: paymentMethod === 'card' })}
                            error={errors.cvv && 'CVV is required'}
                          />
                        </div>
                        <Input
                          label="Cardholder Name"
                          {...register('cardHolder', { required: paymentMethod === 'card' })}
                          error={errors.cardHolder && 'Cardholder name is required'}
                        />
                      </div>
                    )}

                    {/* Mobile Money Form */}
                    {paymentMethod === 'momo' && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">Mobile Money Details</h3>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Select Provider</label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-all"
                            >
                              <div className="font-semibold text-yellow-600">MTN</div>
                            </button>
                            <button
                              type="button"
                              className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-all"
                            >
                              <div className="font-semibold text-red-600">Vodafone</div>
                            </button>
                            <button
                              type="button"
                              className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-all"
                            >
                              <div className="font-semibold text-blue-600">AirtelTigo</div>
                            </button>
                          </div>
                        </div>
                        <Input
                          label="Mobile Money Number"
                          placeholder="0XX XXX XXXX"
                          {...register('momoNumber', { required: paymentMethod === 'momo' })}
                          error={errors.momoNumber && 'Mobile money number is required'}
                        />
                        <Input
                          label="Account Name"
                          placeholder="John Doe"
                          {...register('momoName', { required: paymentMethod === 'momo' })}
                          error={errors.momoName && 'Account name is required'}
                        />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                          <strong>Note:</strong> You will receive a prompt on your phone to authorize the payment.
                        </div>
                      </div>
                    )}

                    {/* Bank Transfer Form */}
                    {paymentMethod === 'bank' && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">Bank Transfer Details</h3>
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bank Name:</span>
                            <span className="font-semibold">Life Goes On Bank</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account Name:</span>
                            <span className="font-semibold">Life Goes On Hub</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account Number:</span>
                            <span className="font-semibold">1234567890</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Branch:</span>
                            <span className="font-semibold">Accra Main</span>
                          </div>
                        </div>
                        <Input
                          label="Reference Number (After Transfer)"
                          placeholder="Enter transaction reference"
                          {...register('bankRef', { required: paymentMethod === 'bank' })}
                          error={errors.bankRef && 'Reference number is required'}
                        />
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                          <strong>Important:</strong> Please complete the bank transfer and enter the reference number above before proceeding.
                        </div>
                      </div>
                    )}

                    {/* PayPal Form */}
                    {paymentMethod === 'paypal' && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">PayPal Payment</h3>
                        <Input
                          label="PayPal Email"
                          type="email"
                          placeholder="your@email.com"
                          {...register('paypalEmail', { required: paymentMethod === 'paypal' })}
                          error={errors.paypalEmail && 'PayPal email is required'}
                        />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                          <strong>Note:</strong> You will be redirected to PayPal to complete the payment securely.
                        </div>
                        <button
                          type="button"
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                          Continue with PayPal
                        </button>
                      </div>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Review Order</h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between py-2 border-b">
                          <span>{item.name} x {item.quantity}</span>
                          <span className="font-semibold">₵{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex gap-4 mt-6">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  )}
                  <Button type="submit" fullWidth>
                    {step === 3 ? `Pay ₵${getTotal().toFixed(2)}` : 'Continue'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div>
            <Card>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₵{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">₵{getTotal().toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
