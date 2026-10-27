import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react'
import api from '../services/api'
import ProductCard from '../components/ui/ProductCard'
import { useCartStore } from '../store/cartStore'

interface Category {
  _id: string
  name: string
  slug: string
  image?: { url: string }
}

interface Product {
  _id: string
  name: string
  slug: string
  images?: { url: string; alt?: string }[]
  variants: any[]
  averageRating?: number
  numReviews?: number
  brand?: string
  category?: { name: string }
  isFeatured?: boolean
}

const CATEGORY_IMAGES: Record<string, string> = {
  'rice-and-grains': 'https://plus.unsplash.com/premium_photo-1705338026411-00639520a438?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D?q=80&w=400&auto=format&fit=crop',
  'rice-grains': 'https://plus.unsplash.com/premium_photo-1705338026411-00639520a438?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D?q=80&w=400&auto=format&fit=crop',
  'rice & grains': 'https://plus.unsplash.com/premium_photo-1705338026411-00639520a438?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D?q=80&w=400&auto=format&fit=crop',
  'pulses-and-dal': 'https://plus.unsplash.com/premium_photo-1664007711018-d7cb92e664b1?q=80&w=400&auto=format&fit=crop',
  'pulses-dal': 'https://plus.unsplash.com/premium_photo-1664007711018-d7cb92e664b1?q=80&w=400&auto=format&fit=crop',
  'pulses & dal': 'https://plus.unsplash.com/premium_photo-1664007711018-d7cb92e664b1?q=80&w=400&auto=format&fit=crop',
  'cooking-oils-and-ghee': 'https://images.unsplash.com/photo-1552592074-ea7a91b851b3?q=80&w=400&auto=format&fit=crop',
  'cooking-oils-ghee': 'https://images.unsplash.com/photo-1552592074-ea7a91b851b3?q=80&w=400&auto=format&fit=crop',
  'cooking oils & ghee': 'https://images.unsplash.com/photo-1552592074-ea7a91b851b3?q=80&w=400&auto=format&fit=crop',
  'cooking oil & ghee': 'https://images.unsplash.com/photo-1552592074-ea7a91b851b3?q=80&w=400&auto=format&fit=crop',
  'spices-and-masala': 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?q=80&w=400&auto=format&fit=crop',
  'spices-masala': 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?q=80&w=400&auto=format&fit=crop',
  'spices & masala': 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?q=80&w=400&auto=format&fit=crop',
  'snacks-and-namkeen': 'https://images.unsplash.com/photo-1687640896971-6bcc3a3bbd71?q=80&w=400&auto=format&fit=crop',
  'snacks-namkeen': 'https://images.unsplash.com/photo-1687640896971-6bcc3a3bbd71?q=80&w=400&auto=format&fit=crop',
  'snacks & namkeen': 'https://images.unsplash.com/photo-1687640896971-6bcc3a3bbd71?q=80&w=400&auto=format&fit=crop',
  'sweets-and-confectionery': 'https://images.unsplash.com/photo-1588756264692-d396bca41fb1?q=80&w=400&auto=format&fit=crop',
  'sweets-confectionery': 'https://images.unsplash.com/photo-1588756264692-d396bca41fb1?q=80&w=400&auto=format&fit=crop',
  'sweets-and-confectionary': 'https://images.unsplash.com/photo-1588756264692-d396bca41fb1?q=80&w=400&auto=format&fit=crop',
  'sweets & confectionery': 'https://images.unsplash.com/photo-1588756264692-d396bca41fb1?q=80&w=400&auto=format&fit=crop',
  'sweets & confectionary': 'https://images.unsplash.com/photo-1588756264692-d396bca41fb1?q=80&w=400&auto=format&fit=crop',
  beverages: 'https://images.unsplash.com/photo-1553787434-dced6fed049e?q=80&w=400&auto=format&fit=crop',
  toiletries: 'https://images.unsplash.com/photo-1706520636650-024a369fbcdf?q=80&w=400&auto=format&fit=crop',
  'kitchen-and-household': 'https://images.unsplash.com/photo-1764344815057-15a438b636ed?q=80&w=400&auto=format&fit=crop',
  'kitchen-household': 'https://images.unsplash.com/photo-1764344815057-15a438b636ed?q=80&w=400&auto=format&fit=crop',
  'kitchen & household': 'https://images.unsplash.com/photo-1764344815057-15a438b636ed?q=80&w=400&auto=format&fit=crop',
  'spreads-and-condiments': 'https://images.unsplash.com/photo-1637906324647-f723b8543aea?q=80&w=400&auto=format&fit=crop',
  'spreads-condiments': 'https://images.unsplash.com/photo-1637906324647-f723b8543aea?q=80&w=400&auto=format&fit=crop',
  'spreads & condiments': 'https://images.unsplash.com/photo-1637906324647-f723b8543aea?q=80&w=400&auto=format&fit=crop',
}

const FALLBACK_CAT_IMG = 'https://placehold.co/200x200/e8f5e9/2e7d32?text=Category'

function getCatImage(cat: Category) {
  if (cat.image?.url) return cat.image.url
  if (cat.slug && CATEGORY_IMAGES[cat.slug]) return CATEGORY_IMAGES[cat.slug]
  const byName = cat.name?.toLowerCase().trim()
  if (byName && CATEGORY_IMAGES[byName]) return CATEGORY_IMAGES[byName]
  if (cat.slug) {
    const simplified = cat.slug.replace(/-and-/g, '-').replace(/--+/g, '-')
    if (CATEGORY_IMAGES[simplified]) return CATEGORY_IMAGES[simplified]
  }
  return FALLBACK_CAT_IMG
}

function CompactProductRow({ product }: { product: Product }) {
  const v = product.variants?.find((x: any) => x.isDefault) || product.variants?.[0]
  return (
    <Link to={`/product/${product.slug}`} className="flex items-center gap-3 py-2.5 hover:bg-gray-50 rounded-lg px-1 transition">
      <img
        src={product.images?.[0]?.url || 'https://placehold.co/64x64/e8f5e9/2e7d32?text=P'}
        alt={product.name}
        className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
        {(product.averageRating ?? 0) > 0 && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-500">{product.averageRating?.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-gray-900">₹{v?.price ?? 0}</span>
          {v && v.mrp > v.price && (
            <span className="text-xs text-gray-400 line-through">₹{v.mrp}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function useCountdown(hours = 10) {
  const [time, setTime] = useState({ h: hours, m: 56, s: 21 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        if (s > 0) s--
        else if (m > 0) {
          m--
          s = 59
        } else if (h > 0) {
          h--
          m = 59
          s = 59
        } else return { h: hours, m: 56, s: 21 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [hours])
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(time.h)} : ${pad(time.m)} : ${pad(time.s)}`
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [dealTab, setDealTab] = useState<'featured' | 'popular' | 'new'>('featured')
  const catRef = useRef<HTMLDivElement>(null)
  const catTrackRef = useRef<HTMLDivElement>(null)
  const featRef = useRef<HTMLDivElement>(null)
  const dealsRef = useRef<HTMLDivElement>(null)
  const countdown = useCountdown(10)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    async function load() {
      setApiError(null)
      try {
        const [catRes, featRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/featured'),
          api.get('/products?limit=24&sort=newest'),
        ])
        setCategories(catRes.data.data || [])
        setFeatured(featRes.data.data || [])
        setProducts(prodRes.data.data || [])
      } catch (err: any) {
        console.error(err)
        const msg =
          err?.code === 'ERR_NETWORK' || !err?.response
            ? 'Cannot reach the API. Start the backend (server folder → npm run dev) and ensure MongoDB is running.'
            : err?.response?.data?.message || 'Failed to load products. Check backend and MongoDB.'
        setApiError(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Auto-scroll categories (desktop + mobile) via transform
  useEffect(() => {
    const track = catTrackRef.current
    if (!track || categories.length === 0) return

    let offset = 0
    let paused = false
    let raf = 0
    let last = performance.now()
    const SPEED = 45

    const pause = () => {
      paused = true
    }
    const resume = () => {
      window.setTimeout(() => {
        paused = false
      }, 1800)
    }

    const viewport = catRef.current
    viewport?.addEventListener('mouseenter', pause)
    viewport?.addEventListener('mouseleave', () => {
      paused = false
    })
    viewport?.addEventListener('touchstart', pause, { passive: true })
    viewport?.addEventListener('touchend', resume, { passive: true })

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!paused && document.visibilityState === 'visible') {
        const half = track.scrollWidth / 2
        if (half > 0) {
          offset += SPEED * dt
          if (offset >= half) offset = 0
          track.style.transform = `translate3d(${-offset}px, 0, 0)`
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const startId = window.setTimeout(() => {
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }, 250)

    return () => {
      window.clearTimeout(startId)
      cancelAnimationFrame(raf)
      viewport?.removeEventListener('mouseenter', pause)
      viewport?.removeEventListener('touchstart', pause)
      viewport?.removeEventListener('touchend', resume)
    }
  }, [categories])

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: number) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  const nudgeCategories = (dir: number) => {
    const track = catTrackRef.current
    if (!track) return
    const match = track.style.transform.match(/-?\d+\.?\d*/)
    let offset = match ? Math.abs(parseFloat(match[0])) : 0
    const half = track.scrollWidth / 2
    offset += dir * 160
    if (offset >= half) offset = 0
    if (offset < 0) offset = Math.max(0, half + offset)
    track.style.transform = `translate3d(${-offset}px, 0, 0)`
  }

  const allForLists = featured.length > 0 ? [...featured, ...products] : products
  const unique = Array.from(new Map(allForLists.map((p) => [p._id, p])).values())
  const topSells = unique.slice(0, 3)
  const topRated = unique.slice(1, 4)
  const trending = unique.slice(2, 5)
  const recent = unique.slice(0, 3).length ? unique.slice(-3).reverse() : unique.slice(0, 3)

  const dealProducts =
    dealTab === 'featured'
      ? featured.length > 0
        ? featured
        : unique.slice(0, 8)
      : dealTab === 'popular'
        ? unique.slice(0, 8)
        : unique.slice(0, 8)

  const handleQuickAdd = (p: Product) => {
    const v = p.variants?.find((x: any) => x.isDefault) || p.variants?.[0]
    if (!v || v.stock < 1) return
    addItem({
      productId: p._id,
      variantId: v._id,
      name: p.name,
      variantName: v.name,
      price: v.price,
      mrp: v.mrp,
      image: p.images?.[0]?.url,
      stock: v.stock,
      slug: p.slug,
    })
  }

  const loopCategories = categories.length > 0 ? [...categories, ...categories] : []

  return (
    <div>
      {apiError && (
        <div className="bg-red-50 border-b border-red-200 text-red-800 text-sm px-4 py-3 text-center">
          <strong>Connection issue:</strong> {apiError}
          <span className="block mt-1 text-xs text-red-600">
            Terminal 1: cd server → npm run dev &nbsp;|&nbsp; MongoDB must be running &nbsp;|&nbsp; If DB is empty: npm run seed
          </span>
        </div>
      )}

      <section className="relative bg-gradient-to-br from-primary-50 via-mint to-primary-100 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-primary-300 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Don&apos;t miss our daily
                <br />
                <span className="text-primary-600">amazing deals.</span>
              </h1>
              <p className="mt-4 text-gray-600 text-lg max-w-md">
                Your trusted neighbourhood kirana store in Beawar. Rice, dals, spices, oils & daily essentials at the best prices.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setEmail('')
                  alert('Thank you! Newsletter will be connected when email service is configured.')
                }}
                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 h-12 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  required
                />
                <button type="submit" className="h-12 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition">
                  Register
                </button>
              </form>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square">
                <img
                  src="https://i.pinimg.com/736x/30/5c/e1/305ce1f91e7c7de0240681396827ed52.jpg?w=600&h=600&fit=crop"
                  alt="Kirana store essentials"
                  className="rounded-2xl object-cover w-full h-full shadow-xl"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=600&fit=crop'
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXPLORE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Explore Categories</h2>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => nudgeCategories(-1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50" aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => nudgeCategories(1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50" aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-32 h-36 shrink-0 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No categories yet. Run seed or add via admin.</p>
        ) : (
          <div ref={catRef} className="overflow-hidden w-full">
            <div ref={catTrackRef} className="flex gap-4 w-max will-change-transform" style={{ transform: 'translate3d(0,0,0)' }}>
              {loopCategories.map((cat, idx) => (
                <Link
                  key={`${cat._id}-${idx}`}
                  to={`/shop/${cat.slug}`}
                  className="shrink-0 w-32 sm:w-36 bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md hover:border-primary-200 transition group"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-50 overflow-hidden flex items-center justify-center">
                    <img src={getCatImage(cat)} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 group-hover:text-primary-600 line-clamp-2">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <div className="flex items-center gap-2">
              <Link to="/shop?featured=true" className="text-primary-600 text-sm font-medium hover:underline mr-2">View all</Link>
              <button type="button" onClick={() => scroll(featRef, -1)} className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50"><ChevronLeft size={18} /></button>
              <button type="button" onClick={() => scroll(featRef, 1)} className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50"><ChevronRight size={18} /></button>
            </div>
          </div>
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-48 h-64 shrink-0 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 && products.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><p>No products yet.</p></div>
          ) : (
            <div ref={featRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
              {(featured.length > 0 ? featured : products)
                .concat(featured.length > 0 ? products.filter((p) => !featured.find((f) => f._id === p._id)) : [])
                .slice(0, 12)
                .map((p) => (
                  <div key={p._id} className="w-44 sm:w-52 shrink-0">
                    <ProductCard product={p} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* PROMO CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden bg-amber-50 p-8 flex flex-col justify-center min-h-[200px]">
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 w-fit px-2 py-1 rounded mb-2">Free delivery</span>
            <h3 className="text-xl font-bold text-gray-900">Free delivery over ₹299</h3>
            <p className="text-gray-600 mt-1 text-sm">Shop ₹299+ and get free delivery in Beawar</p>
            <Link to="/shop" className="mt-4 inline-flex items-center gap-1 text-primary-600 font-semibold text-sm hover:underline">Shop Now <ArrowRight size={16} /></Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-primary-50 p-8 flex flex-col justify-center min-h-[200px]">
            <span className="text-xs font-semibold text-primary-700 bg-primary-100 w-fit px-2 py-1 rounded mb-2">Quality</span>
            <h3 className="text-xl font-bold text-gray-900">Trusted Kirana Quality</h3>
            <p className="text-gray-600 mt-1 text-sm">Fresh stock of rice, dals, spices & essentials from Madhuram Provision Store</p>
            <Link to="/about" className="mt-4 inline-flex items-center gap-1 text-primary-600 font-semibold text-sm hover:underline">Learn more <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* DAILY BEST SELLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Daily Best Sells</h2>
            <div className="flex items-center gap-1 text-sm">
              {(['featured', 'popular', 'new'] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => setDealTab(tab)} className={`px-3 py-1 rounded-full capitalize transition ${dealTab === tab ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {tab === 'new' ? 'New' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              Expires in: <span className="font-mono">{countdown}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(dealsRef, -1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => scroll(dealsRef, 1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2" ref={dealsRef} style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
          {dealProducts.slice(0, 4).map((p, i) => {
            const v = p.variants?.find((x: any) => x.isDefault) || p.variants?.[0]
            const disc = v && v.mrp > v.price ? Math.round(((v.mrp - v.price) / v.mrp) * 100) : 0
            return (
              <div key={p._id} className="w-52 sm:w-56 shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="relative aspect-square bg-gray-50">
                  <img src={p.images?.[0]?.url || 'https://placehold.co/300x300/e8f5e9/2e7d32?text=Product'} alt={p.name} className="w-full h-full object-cover" />
                  {disc > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">Save {disc}%</span>}
                  {i === 1 && <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-semibold px-2 py-0.5 rounded">Best deal</span>}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400">{p.category?.name || p.brand || 'Kirana'}</p>
                  <Link to={`/product/${p.slug}`} className="font-medium text-sm text-gray-900 line-clamp-2 min-h-[2.5rem] hover:text-primary-600">{p.name}</Link>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-bold">₹{v?.price ?? 0}</span>
                    {v && v.mrp > v.price && <span className="text-xs text-gray-400 line-through">₹{v.mrp}</span>}
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(90, 20 + i * 20)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Sold {10 + i * 5}/{30 + i * 10}</p>
                  <button type="button" onClick={() => handleQuickAdd(p)} className="mt-2 w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 rounded-lg transition">Add to cart</button>
                </div>
              </div>
            )
          })}
          <div className="w-52 sm:w-56 shrink-0 bg-amber-50 border border-amber-100 rounded-xl p-5 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900">10% OFF</h3>
            <p className="text-sm text-gray-600 mt-1">For new members sign up for the first time</p>
            <input type="email" placeholder="Email address" className="mt-4 w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500" />
            <input type="password" placeholder="Password" className="mt-2 w-full h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500" />
            <Link to="/register" className="mt-3 w-full text-center bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-lg transition">Register Now</Link>
          </div>
        </div>
      </section>

      {/* TOP LISTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Top Sells</h3>
            <div className="space-y-1">{topSells.length ? topSells.map((p) => <CompactProductRow key={p._id} product={p} />) : <p className="text-sm text-gray-400 py-4">No data yet</p>}</div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Top Rated</h3>
            <div className="space-y-1">{topRated.length ? topRated.map((p) => <CompactProductRow key={p._id} product={p} />) : <p className="text-sm text-gray-400 py-4">No data yet</p>}</div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Trending Items</h3>
            <div className="space-y-1">{trending.length ? trending.map((p) => <CompactProductRow key={p._id} product={p} />) : <p className="text-sm text-gray-400 py-4">No data yet</p>}</div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Recently Added</h3>
            <div className="space-y-1">{recent.length ? recent.map((p) => <CompactProductRow key={p._id} product={p} />) : <p className="text-sm text-gray-400 py-4">No data yet</p>}</div>
          </div>
        </div>
      </section>

      {/* SHOP FASTER */}
      <section className="bg-primary-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Shop Faster With
                <br />
                Madhuram Provision Store
              </h2>
              <p className="mt-4 text-gray-600 max-w-md">
                Order rice, dals, spices and daily essentials online from your neighbourhood kirana store in Beawar.
              </p>
              <div className="mt-8">
                <Link to="/shop" className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-900 transition">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[10px] opacity-80">Continue shopping on</div>
                    <div className="text-sm font-semibold">Our Website</div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative flex gap-4 items-end">
                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=280&h=500&fit=crop" alt="Shopping preview" className="w-40 sm:w-48 rounded-2xl shadow-2xl object-cover border-4 border-white" />
                <img src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=280&h=500&fit=crop" alt="Cart screen" className="w-40 sm:w-48 rounded-2xl shadow-2xl object-cover border-4 border-white hidden sm:block -mb-4" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}