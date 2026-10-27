import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Madhuram Provision Store</h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
        <p>
          Madhuram Provision Store is a trusted neighbourhood kirana store based in Beawar, Rajasthan.
          It is owned by two Sindhi brothers — <strong>Raju Jeswani</strong> and <strong>Tulsi Jeswani</strong> —
          who have many years of experience in the kirana and provision trade.
        </p>
        <p>
          The store has been successfully operating offline and now aims to scale by offering the same
          quality products and service online, making it convenient for customers in and around Beawar
          to order daily essentials from the comfort of their homes.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">What we offer</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Different varieties of rice</li>
          <li>Pulses & dals — toor, chana, urad, masoor and more</li>
          <li>Cooking oils, ghee and butter</li>
          <li>All types of spices — salt, mirchi, haldi, garam masala, etc.</li>
          <li>Snacks, namkeens, biscuits and packaged foods</li>
          <li>Sweets, chocolates, toffees and candies</li>
          <li>Spreads and condiments</li>
          <li>Beverages — tea, coffee and soft drinks</li>
          <li>Toiletries — soaps, shampoos and personal care</li>
          <li>Kitchen & household essentials — cleansers, detergents, etc.</li>
        </ul>
        <p className="mt-4">
          We do <strong>not</strong> sell fresh fruits and vegetables. Our focus is on dry provisions
          and daily household needs that a traditional kirana store is known for.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
        <p>
          Phone: <a href="tel:+91 9462498113" className="text-primary-600">+91 9462498113</a> (Raju Jeswani) ·{' '}
          <a href="tel:+91 9414259167" className="text-primary-600">+91 9414259167</a> (Tulsi Jeswani)
        </p>
        <p>Location: Bhagat Chauraya, Beawar, Rajasthan</p>
        <p className="mt-6">
          <Link to="/shop" className="text-primary-600 font-semibold hover:underline">
            Start shopping →
          </Link>
        </p>
      </div>
    </div>
  )
}
