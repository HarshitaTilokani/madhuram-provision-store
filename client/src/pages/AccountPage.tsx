import { Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        {user?.phone && (
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
        )}
        <div className="pt-4 flex flex-wrap gap-3">
          <Link to="/account/orders" className="text-primary-600 font-medium hover:underline">
            View Orders
          </Link>
          <Link to="/wishlist" className="text-primary-600 font-medium hover:underline">
            Wishlist
          </Link>
          <button onClick={() => logout()} className="text-red-600 font-medium hover:underline">
            Logout
          </button>
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Address management, order history details and password change will be expanded in the next iteration.
      </p>
    </div>
  )
}
