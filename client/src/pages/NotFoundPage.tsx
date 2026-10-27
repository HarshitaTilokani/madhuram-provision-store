import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary-500 mb-2">404</h1>
      <p className="text-xl text-gray-700 mb-6">Page not found</p>
      <Link to="/" className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600">
        Go Home
      </Link>
    </div>
  )
}
