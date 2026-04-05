import { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Filter, LogOut, Search, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import { Logo } from '../components/Logo'
import { ShopProductCard } from '../components/ShopProductCard'
import { useCart } from '../context/CartContext'
import { getCurrentUser, logoutUser } from '../utils/auth'

export function ShopPage() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const { addToCart, cartSummary } = useCart()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [sortBy, setSortBy] = useState('Featured')

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      try {
        const response = await fetch('/products.json')

        if (!response.ok) {
          throw new Error('Failed to load products.')
        }

        const data = await response.json()

        if (isMounted) {
          setProducts(data)
        }
      } catch {
        toast.error('Unable to load shop products from the local feed.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(
    () => ['All Categories', ...new Set(products.map((product) => product.category))],
    [products],
  )

  const visibleProducts = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        categoryFilter === 'All Categories' || product.category === categoryFilter

      return matchesSearch && matchesCategory
    })

    const sortedProducts = [...filteredProducts]

    if (sortBy === 'Price: Low to High') {
      sortedProducts.sort((left, right) => left.price - right.price)
    }

    if (sortBy === 'Price: High to Low') {
      sortedProducts.sort((left, right) => right.price - left.price)
    }

    if (sortBy === 'Featured') {
      sortedProducts.sort((left, right) => (right.rating?.rate ?? 0) - (left.rating?.rate ?? 0))
    }

    return sortedProducts
  }, [categoryFilter, products, searchTerm, sortBy])

  const handleLogout = () => {
    logoutUser()
    toast.success('You have been logged out.')
    navigate('/login')
  }

  return (
    <div className="app-shell app-shell-centered">
      <header className="topbar panel">
        <Logo />
        <nav className="topnav" aria-label="Primary">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="top-actions">
          {currentUser ? <span className="session-pill">{currentUser.name}</span> : null}
          <button className="icon-button" type="button" onClick={() => navigate('/')} aria-label="Back home">
            <ArrowLeft size={17} />
          </button>
          <button className="cart-button icon-button" type="button" onClick={() => navigate('/')}>
            <ShoppingCart size={17} />
            {cartSummary.itemCount > 0 ? <span className="cart-badge">{cartSummary.itemCount}</span> : null}
          </button>
          <button className="ghost-button" type="button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="shop-page">
        <section className="shop-hero">
          <p className="eyebrow">SkyMart store</p>
          <h1>All Products</h1>
          <p className="shop-subtitle">
            {isLoading ? 'Loading your product feed...' : `${visibleProducts.length} products found`}
          </p>
        </section>

        <section className="shop-toolbar panel">
          <label className="search-field" aria-label="Search products">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="filter-select">
            <Filter size={17} />
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </label>

          <label className="filter-select">
            <span className="visually-hidden">Sort products</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="Featured">Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
            <ChevronDown size={16} />
          </label>
        </section>

        <section className="shop-grid">
          {isLoading ? (
            <p className="loading-copy">Loading products from local feed...</p>
          ) : visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <ShopProductCard
                key={product.id}
                {...product}
                onAdd={() => {
                  addToCart(product)
                  toast.success(`${product.title} added to cart.`)
                }}
              />
            ))
          ) : (
            <p className="loading-copy">No products match your filters.</p>
          )}
        </section>
      </main>
    </div>
  )
}