import { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BellRing,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  LayoutGrid,
  Layers3,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { CategoryCard } from '../components/CategoryCard'
import { Logo } from '../components/Logo'
import { ProductCard } from '../components/ProductCard'
import { StatCard } from '../components/StatCard'
import { useCart } from '../context/CartContext'
import { getCurrentUser, logoutUser } from '../utils/auth'

const categoryIconMap = {
  electronics: LayoutGrid,
  jewelery: Sparkles,
  "men's clothing": Boxes,
  "women's clothing": Layers3,
}

export function HomePage() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const {
    cartItems,
    cartSummary,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    checkout,
  } = useCart()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)

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
        toast.error('Unable to load products from the local feed.')
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

  const categories = useMemo(() => {
    const counts = products.reduce((accumulator, product) => {
      accumulator[product.category] = (accumulator[product.category] || 0) + 1
      return accumulator
    }, {})

    return Object.entries(counts).map(([category, count]) => ({
      label: category,
      count: `${count} items`,
      icon: categoryIconMap[category.toLowerCase()] || ShieldCheck,
    }))
  }, [products])

  const topRated = useMemo(() => {
    const sectionItems = products.filter((product) => product.section === 'topRated')

    if (sectionItems.length > 0) {
      return sectionItems.slice(0, 5)
    }

    return [...products]
      .sort((left, right) => (right.rating?.rate ?? right.rating ?? 0) - (left.rating?.rate ?? left.rating ?? 0))
      .slice(0, 5)
  }, [products])

  const arrivals = useMemo(() => {
    const sectionItems = products.filter((product) => product.section === 'newArrival')

    if (sectionItems.length > 0) {
      return sectionItems.slice(0, 5)
    }

    return [...products].sort((left, right) => right.id - left.id).slice(0, 5)
  }, [products])

  const handleShopNow = () => {
    navigate('/shop')
  }

  const handleViewAll = () => {
    navigate('/shop')
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    setIsCartOpen(true)
    toast.success(`${product.title} added to cart.`)
  }

  const handleCheckout = () => {
    try {
      if (!currentUser) {
        toast.error('Sign in before checkout.')
        navigate('/login')
        return
      }

      const order = checkout({
        name: currentUser.name,
        email: currentUser.email,
      })

      setIsCartOpen(false)
      toast.success(`Order ${order.orderId} created. Cart cleared.`)
    } catch (error) {
      toast.error(error.message)
    }
  }

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
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="top-actions">
          {currentUser ? <span className="session-pill">{currentUser.name}</span> : null}
          <button className="ghost-button" type="button" onClick={handleLogout}>
            Logout
          </button>
          <button className="cart-button icon-button" type="button" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={17} />
            {cartSummary.itemCount > 0 ? <span className="cart-badge">{cartSummary.itemCount}</span> : null}
          </button>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="hero panel">
          <div className="hero-copy">
            <p className="eyebrow">Good afternoon</p>
            <h1>Welcome back, {currentUser?.name || 'Akhil'}!</h1>
            <p className="hero-text">
              Discover today&apos;s picks from the local product feed with live cart totals, product images,
              and one-click checkout.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={handleShopNow}>
                Shop Now <ArrowRight size={18} />
              </button>
              <button className="secondary-button" type="button" onClick={handleViewAll}>
                View All Products
              </button>
            </div>
          </div>

          <div className="hero-side">
            <div className="mini-metric accent">
              <span>{isLoading ? '...' : `${products.length}+`}</span>
              <small>Products from local feed</small>
            </div>
            <div className="mini-metric">
              <span>{cartSummary.itemCount}</span>
              <small>Items in cart</small>
            </div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Store stats">
          <StatCard
            icon={ShoppingCart}
            value={isLoading ? '...' : String(cartSummary.itemCount)}
            label="Cart items"
            hint="Ready to checkout"
          />
          <StatCard
            icon={CircleDollarSign}
            value={isLoading ? '...' : `$${cartSummary.total.toFixed(2)}`}
            label="Cart value"
            hint="Auto-updated from cart"
          />
          <StatCard
            icon={Star}
            value={isLoading ? '...' : String(topRated.length)}
            label="Top products"
            hint="Highly rated"
          />
          <StatCard
            icon={Zap}
            value={isLoading ? '...' : String(categories.length)}
            label="Categories"
            hint="To explore"
          />
        </section>

        <section className="section-header" id="categories">
          <div>
            <p className="section-kicker">Shop by category</p>
            <h2>Browse what fits your day</h2>
          </div>
          <button className="link-button" type="button" onClick={handleViewAll}>
            View all <ChevronRight size={16} />
          </button>
        </section>

        <section className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.label} {...category} />
          ))}
        </section>

        <section className="product-columns" id="featured-products">
          <div className="product-panel panel">
            <div className="panel-header">
              <div>
                <p className="panel-title">Top rated</p>
                <small>Sorted by product rating</small>
              </div>
              <button className="link-button" type="button" onClick={handleViewAll}>
                See all <ChevronRight size={16} />
              </button>
            </div>
            <div className="product-list">
              {isLoading ? (
                <p className="loading-copy">Loading products from local feed...</p>
              ) : (
                topRated.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAdd={() => handleAddToCart(product)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="product-panel panel">
            <div className="panel-header">
              <div>
                <p className="panel-title">New arrivals</p>
                <small>Latest products first</small>
              </div>
              <button className="link-button" type="button" onClick={handleViewAll}>
                See all <ChevronRight size={16} />
              </button>
            </div>
            <div className="product-list">
              {isLoading ? (
                <p className="loading-copy">Loading products from local feed...</p>
              ) : (
                arrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAdd={() => handleAddToCart(product)}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="features-row">
          <article className="feature-card panel">
            <Truck size={18} />
            <div>
              <strong>Fast delivery</strong>
              <p>Same-day on selected items.</p>
            </div>
          </article>
          <article className="feature-card panel">
            <ShieldCheck size={18} />
            <div>
              <strong>Secure payments</strong>
              <p>Encrypted checkout flow.</p>
            </div>
          </article>
          <article className="feature-card panel">
            <BellRing size={18} />
            <div>
              <strong>Best prices</strong>
              <p>Price-match guarantee.</p>
            </div>
          </article>
        </section>

        <footer className="footer panel">
          <Logo compact />
          <p>SkyMart store experience built with React, React Router, lucide-react, and toast feedback.</p>
        </footer>
      </main>

      {isCartOpen ? <button className="cart-backdrop" type="button" aria-label="Close cart" onClick={() => setIsCartOpen(false)} /> : null}

      <aside className={`cart-drawer panel ${isCartOpen ? 'open' : ''}`} aria-label="Cart drawer">
        <header className="cart-drawer-header">
          <div>
            <span className="cart-drawer-title">Cart</span>
            <span className="session-pill cart-pill">{cartSummary.itemCount} items</span>
          </div>
          <button className="icon-button" type="button" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X size={17} />
          </button>
        </header>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <p className="cart-empty">Your cart is empty. Add a product to start shopping.</p>
          ) : (
            cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div className="cart-item-info">
                  <strong>{item.title}</strong>
                  <small>${item.price.toFixed(2)} each</small>
                  <div className="cart-item-controls">
                    <button type="button" onClick={() => decrementItem(item.id)} aria-label={`Decrease ${item.title}`}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => incrementItem(item.id)} aria-label={`Increase ${item.title}`}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button className="cart-remove" type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`}>
                  <X size={15} />
                </button>
              </article>
            ))
          )}
        </div>

        <footer className="cart-drawer-footer">
          <div className="cart-total-row">
            <span>Total</span>
            <strong>${cartSummary.total.toFixed(2)}</strong>
          </div>
          <button className="primary-button cart-checkout" type="button" onClick={handleCheckout}>
            Checkout <ArrowRight size={18} />
          </button>
          <button className="ghost-button cart-clear" type="button" onClick={clearCart}>
            Clear cart
          </button>
        </footer>
      </aside>
    </div>
  )
}