import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      {/* Benefits strip */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <span className="text-xl">₹</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Best Prices & Deals</h4>
                <p className="text-sm text-gray-500">Competitive prices on daily essentials</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <span className="text-xl">↻</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-500">Hassle-free returns on eligible items</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <span className="text-xl">🚚</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Local Delivery</h4>
                <p className="text-sm text-gray-500">Free delivery over ₹299 in Beawar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <span className="font-bold text-lg text-gray-900 block">Madhuram</span>
                <span className="text-xs text-primary-600 font-medium">Provision Store</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Your trusted neighbourhood kirana store in Beawar, Rajasthan. Owned by Raju Jeswani & Tulsi Jeswani.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-500" />
                <span>Bhagat Chauraya, Beawar, Rajasthan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-primary-500" />
                <a href="tel:+91 9462498113" className="hover:text-primary-600">+91 9462498113</a>
                <span className="text-gray-300">|</span>
                <a href="tel:+91 9414259167" className="hover:text-primary-600">+91 9414259167</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-primary-500" />
                <span>madhuramprovisionstore@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-primary-500" />
                <span>8:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/wishlist" className="hover:text-primary-600">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-primary-600">Cart</Link></li>
              <li><Link to="/account/orders" className="hover:text-primary-600">Track Order</Link></li>
              <li><Link to="/account" className="hover:text-primary-600">My Account</Link></li>
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Useful links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-primary-600">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600">Contact</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-primary-600">Hot Deals</Link></li>
              <li><Link to="/shop" className="hover:text-primary-600">All Products</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Help Center</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/contact" className="hover:text-primary-600">Support</Link></li>
              <li><span className="text-gray-400">Payments (Razorpay)</span></li>
              <li><span className="text-gray-400">Shipping Policy</span></li>
              <li><span className="text-gray-400">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Madhuram Provision Store. All rights reserved.</p>
          <p className="text-xs">Beawar, Rajasthan · Online Kirana Store</p>
        </div>
      </div>
    </footer>
  )
}
