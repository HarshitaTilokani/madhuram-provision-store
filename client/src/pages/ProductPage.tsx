import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ShoppingCart, Minus, Plus, Star } from 'lucide-react'
import api from '../services/api'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [qty, setQty] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const { has, toggle } = useWishlistStore()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api
      .get(`/products/${slug}`)
      .then((r) => {
        setProduct(r.data.data)
        const def = r.data.data.variants?.find((v: any) => v.isDefault) || r.data.data.variants?.[0]
        setSelectedVariant(def)
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600 mb-4">Product not found</p>
        <Link to="/shop" className="text-primary-600 font-medium">
          Back to shop
        </Link>
      </div>
    )
  }

  const discount =
    selectedVariant && selectedVariant.mrp > selectedVariant.price
      ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
      : 0

  const handleAdd = () => {
    if (!selectedVariant || selectedVariant.stock < 1) return
    addItem({
      productId: product._id,
      variantId: selectedVariant._id,
      name: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      mrp: selectedVariant.mrp,
      image: product.images?.[0]?.url,
      stock: selectedVariant.stock,
      slug: product.slug,
      quantity: qty,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary-600">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
          <img
            src={product.images?.[0]?.url || 'https://placehold.co/600x600/e8f5e9/2e7d32?text=Product'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          {product.category && (
            <p className="text-sm text-primary-600 font-medium mb-1">{product.category.name}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.brand && <p className="text-sm text-gray-500 mt-1">Brand: {product.brand}</p>}

          {(product.averageRating ?? 0) > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm">{product.averageRating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
          )}

          {selectedVariant && (
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{selectedVariant.price}</span>
              {selectedVariant.mrp > selectedVariant.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{selectedVariant.mrp}</span>
                  <span className="text-sm font-semibold text-red-500">{discount}% off</span>
                </>
              )}
            </div>
          )}

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Select size</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v._id}
                    onClick={() => {
                      setSelectedVariant(v)
                      setQty(1)
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                      selectedVariant?._id === v._id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {v.name} — ₹{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <p className="mt-4 text-sm">
            {selectedVariant?.stock > 0 ? (
              <span className="text-primary-600 font-medium">In stock ({selectedVariant.stock} available)</span>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
          </p>

          {/* Qty + actions */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button
                onClick={() =>
                  setQty(Math.min(selectedVariant?.stock || 1, qty + 1))
                }
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!selectedVariant || selectedVariant.stock < 1}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            <button
              onClick={() => toggle(product._id)}
              className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              aria-label="Wishlist"
            >
              <Heart
                size={20}
                className={has(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
              />
            </button>
          </div>

          {product.shortDescription && (
            <p className="mt-8 text-gray-600">{product.shortDescription}</p>
          )}
          {product.description && (
            <div className="mt-4 text-sm text-gray-600 whitespace-pre-line">
              {product.description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
