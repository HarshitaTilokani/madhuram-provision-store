import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'

interface Variant {
  _id: string
  name: string
  price: number
  mrp: number
  stock: number
  isDefault?: boolean
}

interface ProductCardProps {
  product: {
    _id: string
    name: string
    slug: string
    images?: { url: string; alt?: string }[]
    variants: Variant[]
    averageRating?: number
    numReviews?: number
    brand?: string
    category?: { name: string }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { has, toggle } = useWishlistStore()
  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0]
  const discount =
    defaultVariant && defaultVariant.mrp > defaultVariant.price
      ? Math.round(((defaultVariant.mrp - defaultVariant.price) / defaultVariant.mrp) * 100)
      : 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!defaultVariant || defaultVariant.stock < 1) return
    addItem({
      productId: product._id,
      variantId: defaultVariant._id,
      name: product.name,
      variantName: defaultVariant.name,
      price: defaultVariant.price,
      mrp: defaultVariant.mrp,
      image: product.images?.[0]?.url,
      stock: defaultVariant.stock,
      slug: product.slug,
    })
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.images?.[0]?.url || 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Product'}
            alt={product.images?.[0]?.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggle(product._id)
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition"
            aria-label="Wishlist"
          >
            <Heart
              size={16}
              className={has(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
            />
          </button>
        </div>
        <div className="p-3">
          {product.category && (
            <p className="text-xs text-gray-400 mb-0.5">{product.category.name}</p>
          )}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          {defaultVariant && (
            <p className="text-xs text-gray-500 mt-0.5">{defaultVariant.name}</p>
          )}
          {(product.averageRating ?? 0) > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-600">
                {product.averageRating?.toFixed(1)} ({product.numReviews || 0})
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-gray-900">
                ₹{defaultVariant?.price ?? 0}
              </span>
              {defaultVariant && defaultVariant.mrp > defaultVariant.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{defaultVariant.mrp}
                </span>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={!defaultVariant || defaultVariant.stock < 1}
              className="flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={14} />
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
