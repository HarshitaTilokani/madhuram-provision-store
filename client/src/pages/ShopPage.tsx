import { useEffect, useState } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ui/ProductCard'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { category: categorySlug } = useParams()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'
  const featured = searchParams.get('featured') || ''

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', '12')
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)
    if (featured) params.set('featured', featured)
    if (categorySlug) params.set('category', categorySlug)

    api
      .get(`/products?${params}`)
      .then((r) => {
        setProducts(r.data.data || [])
        setPagination(r.data.pagination || { page: 1, pages: 1, total: 0 })
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [page, search, sort, featured, categorySlug])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0">
          <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link
                to="/shop"
                className={`block py-1.5 ${!categorySlug ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'}`}
              >
                All Products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c._id}>
                <Link
                  to={`/shop/${c.slug}`}
                  className={`block py-1.5 ${categorySlug === c.slug ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="font-semibold text-gray-900 mt-6 mb-3">Sort by</h3>
          <select
            value={sort}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams)
              p.set('sort', e.target.value)
              p.set('page', '1')
              setSearchParams(p)
            }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {categorySlug
                ? categories.find((c) => c.slug === categorySlug)?.name || 'Shop'
                : search
                ? `Search: “${search}”`
                : featured
                ? 'Featured Products'
                : 'All Products'}
            </h1>
            <p className="text-sm text-gray-500">{pagination.total} products</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg mb-2">No products found</p>
              <p className="text-sm">Try a different category or search term.</p>
              <Link to="/shop" className="mt-4 inline-block text-primary-600 font-medium">
                Browse all
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams)
                        params.set('page', String(p))
                        setSearchParams(params)
                      }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        p === page
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
