import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import useCartStore from '../store/cartStore'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Process payment
      alert('Order placed successfully!')
      clearCart()
      navigate('/orders')
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'card' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">💳</div>
                        <div className="text-sm font-medium">Card</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'momo' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">📱</div>
                        <div className="text-sm font-medium">Mobile Money</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'bank' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">🏦</div>
                        <div className="text-sm font-medium">Bank Transfer</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'paypal' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">🅿️</div>
                        <div className="text-sm font-medium">PayPal</div>
                      </button>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900">💳 Credit/Debit Card Details</h3>
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
                        <h3 className="text-lg font-semibold text-gray-900">📱 Mobile Money Details</h3>
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
                      <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900">🏦 Bank Transfer Details</h3>
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
                      <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900">🅿️ PayPal Payment</h3>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'card' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">💳</div>
                        <div className="text-sm font-medium">Card</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'momo' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">📱</div>
                        <div className="text-sm font-medium">Mobile Money</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'bank' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">🏦</div>
                        <div className="text-sm font-medium">Bank Transfer</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === 'paypal' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">🅿️</div>
                        <div className="text-sm font-medium">PayPal</div>
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
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
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
                    {step === 3 ? 'Place Order' : 'Continue'}
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
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">${getTotal().toFixed(2)}</span>
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
