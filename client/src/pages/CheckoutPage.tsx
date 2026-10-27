import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )
  const { isAuthenticated } = useAuthStore()

  const FREE_DELIVERY_MIN = 299
  const DELIVERY_CHARGE = 80
  const deliveryFee = subtotal < FREE_DELIVERY_MIN ? DELIVERY_CHARGE : 0
  const orderTotal = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl mb-4">Your cart is empty</p>
        <Link to="/shop" className="text-primary-600 font-medium">
          Continue shopping
        </Link>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl mb-4">Please login to continue checkout</p>
        <Link
          to="/login"
          className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <p className="font-medium text-amber-800">
          Payment & delivery configuration required
        </p>
        <p className="text-sm text-amber-700 mt-2">
          Razorpay credentials, delivery rules and full address form will be
          activated once you provide:
        </p>
        <ul className="text-sm text-amber-700 mt-2 list-disc pl-5">
          <li>RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET</li>
          <li>Delivery radius / charges for Beawar</li>
          <li>Full store address for pickup/delivery reference</li>
        </ul>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Order summary</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li
              key={`${i.productId}-${i.variantId}`}
              className="flex justify-between"
            >
              <span>
                {i.name} ({i.variantName}) × {i.quantity}
              </span>
              <span>₹{i.price * i.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery charge</span>
            <span>
              {deliveryFee === 0 ? (
                <span className="text-primary-600 font-medium">Free</span>
              ) : (
                <>₹{deliveryFee.toFixed(2)}</>
              )}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total</span>
            <span>₹{orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600 text-center sm:text-left">
        {subtotal < FREE_DELIVERY_MIN ? (
          <>
            ₹{DELIVERY_CHARGE} delivery charge applies on orders below ₹
            {FREE_DELIVERY_MIN}.
          </>
        ) : (
          <>Free delivery applied (order is ₹{FREE_DELIVERY_MIN} or more).</>
        )}
      </p>
    </div>
  )
}