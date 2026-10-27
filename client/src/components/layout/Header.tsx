import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingCart, User, Menu, X, Phone, LayoutGrid, Home, Flame, Tag, Sparkles } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { useAuthStore } from '../../store/authStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const totalItems = useCartStore((s) => s.totalItems())
  const wishlistCount = useWishlistStore((s) => s.productIds.length)
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-gray-900 leading-tight block">Madhuram</span>
                <span className="text-xs text-primary-600 font-medium -mt-0.5 block">Provision Store</span>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for rice, dal, spices, oil..."
                  className="w-full h-11 pl-4 pr-12 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-1 sm:gap-3">
              <a
                href="tel:+91 9462498113"
                className="hidden lg:flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600"
              >
                <Phone size={16} />
                <span>+91 9462498113</span>
              </a>

              <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-primary-600 transition" aria-label="Wishlist">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition" aria-label="Cart">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 p-2 text-gray-600 hover:text-primary-600">
                    <User size={22} />
                    <span className="hidden sm:inline text-sm font-medium max-w-[80px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/account" className="block px-4 py-2.5 text-sm hover:bg-gray-50">My Account</Link>
                    <Link to="/account/orders" className="block px-4 py-2.5 text-sm hover:bg-gray-50">Orders</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2.5 text-sm hover:bg-gray-50">Admin Panel</Link>
                    )}
                    <button onClick={() => logout()} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 p-2 text-gray-600 hover:text-primary-600">
                  <User size={22} />
                  <span className="hidden sm:inline text-sm">Login</span>
                </Link>
              )}

              <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav bar — enlarged, Figma sequence */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 h-14 text-sm font-medium">
            <Link
              to="/shop"
              className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-lg hover:bg-primary-600 transition shrink-0"
            >
              <LayoutGrid size={18} />
              Browse All Categories
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 transition whitespace-nowrap">
              <Home size={16} />
              Home
            </Link>
            <Link to="/shop?featured=true" className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 transition whitespace-nowrap">
              <Flame size={16} />
              Hot deals
            </Link>
            <Link to="/shop?featured=true" className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 transition whitespace-nowrap">
              <Tag size={16} />
              Promotions
            </Link>
            <Link to="/shop?sort=newest" className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 transition whitespace-nowrap">
              <Sparkles size={16} />
              New products
            </Link>
            <a
              href="tel:+91 9462498113"
              className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 transition whitespace-nowrap ml-auto"
            >
              <Phone size={16} />
              +91 9462498113 / Support
            </a>
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-11 pl-4 pr-12 rounded-full border border-gray-200 text-sm"
                />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                  <Search size={16} />
                </button>
              </form>
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="block py-2 font-medium">Browse All Categories</Link>
              <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2">Home</Link>
              <Link to="/shop?featured=true" onClick={() => setMobileOpen(false)} className="block py-2">Hot deals</Link>
              <Link to="/shop?featured=true" onClick={() => setMobileOpen(false)} className="block py-2">Promotions</Link>
              <Link to="/shop?sort=newest" onClick={() => setMobileOpen(false)} className="block py-2">New products</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-2">About Us</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-2">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
