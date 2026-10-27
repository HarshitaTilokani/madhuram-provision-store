import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import api from '../services/api'
import { useWishlistStore } from '../store/wishlistStore'
import ProductCard from '../components/ui/ProductCard'

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    // Fetch products - for now load all and filter (improve with backend batch later)
    api
      .get('/products?limit=50')
      .then((r) => {
        const all = r.data.data || []
        setProducts(all.filter((p: any) => productIds.includes(p._id)))
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [productIds])

  if (!loading && productIds.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-6">Save products you love for later.</p>
        <Link to="/shop" className="inline-block bg-primary-500 text-white font-semibold px-6 py-3 rounded-lg">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Wishlist ({productIds.length})</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
