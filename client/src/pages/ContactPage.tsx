import { Phone, MapPin, Clock, Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-10">We’re here to help. Reach out anytime.</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <Phone className="text-primary-500 mb-3" size={24} />
          <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
          <p className="text-sm text-gray-600">
            <a href="tel:+91 9462498113" className="hover:text-primary-600">+91 9462498113</a> — Raju Jeswani
          </p>
          <p className="text-sm text-gray-600">
            <a href="tel:+91 9414259167" className="hover:text-primary-600">+91 9414259167</a> — Tulsi Jeswani
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <MapPin className="text-primary-500 mb-3" size={24} />
          <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
          <p className="text-sm text-gray-600">[ADD FULL STORE ADDRESS]</p>
          <p className="text-sm text-gray-600">Beawar, Rajasthan</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <Clock className="text-primary-500 mb-3" size={24} />
          <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
          <p className="text-sm text-gray-600">8:00 AM – 9:00 PM</p>
          <p className="text-sm text-gray-600">Monday – Sunday</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <Mail className="text-primary-500 mb-3" size={24} />
          <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
          <p className="text-sm text-gray-600">[ADD BUSINESS EMAIL]</p>
        </div>
      </div>

      <div className="bg-primary-50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Visit our store</h2>
        <p className="text-gray-600 mb-4">
          Prefer shopping in person? Visit Madhuram Provision Store in Beawar for the full range of products and personal service.
        </p>
        <p className="text-sm text-gray-500">Exact address will be updated once provided.</p>
      </div>
    </div>
  )
}
