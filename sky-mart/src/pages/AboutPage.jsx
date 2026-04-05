import { NavLink, useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  Handshake,
  Leaf,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  Users,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Logo } from '../components/Logo'
import { getCurrentUser, logoutUser } from '../utils/auth'

const statItems = [
  { value: '20k+', label: 'Products', icon: ShoppingBag },
  { value: '50k+', label: 'Happy customers', icon: Users },
  { value: '4.9', label: 'Avg rating', icon: Star },
  { value: '99%', label: 'On-time delivery', icon: Truck },
]

const values = [
  {
    title: 'Trust',
    icon: ShieldCheck,
    text: 'Every product is verified for quality and authenticity before listing.',
  },
  {
    title: 'Speed',
    icon: Zap,
    text: 'Quick checkout and delivery updates from cart to your doorstep.',
  },
  {
    title: 'Community',
    icon: Handshake,
    text: 'Built with customer feedback, not just business metrics.',
  },
  {
    title: 'Quality',
    icon: BadgeCheck,
    text: 'No fillers, no junk, only curated products customers keep.',
  },
]

const team = [
  { name: 'Aryan Shah', role: 'Founder & CEO', color: 'var(--accent-lime)' },
  { name: 'Priya Mehta', role: 'Head of Product', color: '#4d8dff' },
  { name: 'Rohan Verma', role: 'Lead Engineer', color: '#a85cff' },
  { name: 'Sneha Kapoor', role: 'Brand Manager', color: '#ff5679' },
]

export function AboutPage() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

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
          <button className="icon-button" type="button" onClick={() => navigate('/shop')}>
            <ShoppingCart size={17} />
          </button>
          {currentUser ? (
            <button className="ghost-button" type="button" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          ) : null}
        </div>
      </header>

      <main className="about-page">
        <section className="about-hero">
          <span className="about-icon">
            <Zap size={20} strokeWidth={2.5} />
          </span>
          <h1>
            About <span>SkyMart</span>
          </h1>
          <p>
            SkyMart is a next-generation e-commerce platform built to make online shopping
            fast, fair, and enjoyable for everyone.
          </p>
        </section>

        <section className="about-stats">
          {statItems.map((stat) => (
            <article className="about-stat-card panel" key={stat.label}>
              <stat.icon size={16} />
              <strong>{stat.value}</strong>
              <small>{stat.label}</small>
            </article>
          ))}
        </section>

        <section className="about-story panel">
          <h2>Our Story</h2>
          <p>
            SkyMart started in 2023 as a small idea: create a marketplace where people feel
            confident, not confused. We focused on trusted products, clear pricing, and a
            smooth checkout.
          </p>
          <p>
            Today we serve thousands of customers with a team that values speed,
            transparency, and product quality above everything else.
          </p>
        </section>

        <section className="about-values">
          <h2>What We Stand For</h2>
          <div className="about-values-grid">
            {values.map((item) => (
              <article className="about-value-card panel" key={item.title}>
                <item.icon size={16} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-team">
          <h2>Meet the Team</h2>
          <div className="about-team-grid">
            {team.map((member) => (
              <article className="about-member panel" key={member.name}>
                <span className="member-badge" style={{ background: member.color }}>
                  {member.name[0]}
                </span>
                <strong>{member.name}</strong>
                <small>{member.role}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta panel">
          <Leaf size={18} />
          <h2>Ready to shop?</h2>
          <p>Explore curated products at unbeatable prices.</p>
          <button className="primary-button" type="button" onClick={() => navigate('/shop')}>
            Browse Products <ShoppingBag size={16} />
          </button>
        </section>
      </main>
    </div>
  )
}