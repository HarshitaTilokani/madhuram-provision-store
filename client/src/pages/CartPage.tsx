import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>
        <Link
          to="/shop"
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const total = subtotal()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({totalItems()} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4"
            >
              <Link to={`/product/${item.slug}`} className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={item.image || 'https://placehold.co/100x100/e8f5e9/2e7d32?text=P'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">{item.variantName}</p>
                <p className="font-semibold mt-1">₹{item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-red-500 hover:text-red-600 p-1"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold">₹{item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-6 h-fit sticky top-28">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="text-gray-500">Calculated at checkout</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-sm text-primary-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
