import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Eye, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { Logo } from '../components/Logo'
import { loginUser } from '../utils/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    try {
      loginUser({ email, password })
      toast.success('Signed in successfully. Welcome back.')
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-hero panel">
        <Logo />
        <p className="eyebrow">Welcome back</p>
        <h1>Shop the future. Today.</h1>
        <p className="hero-text">
          Thousands of products, lightning-fast delivery, and pricing that feels fair.
        </p>
        <div className="auth-metrics">
          <div className="mini-metric">
            <span>20k+</span>
            <small>Products</small>
          </div>
          <div className="mini-metric">
            <span>50k+</span>
            <small>Users</small>
          </div>
          <div className="mini-metric">
            <span>4.9★</span>
            <small>Rating</small>
          </div>
        </div>
      </div>

      <section className="auth-card panel">
        <p className="panel-title">Sign in</p>
        <small>Enter your credentials to continue</small>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <Mail size={16} />
            <input
              type="email"
              placeholder="darkwarrior1234@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="field">
            <Lock size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="field-action"
              aria-label="Show password"
              onClick={() => setShowPassword((current) => !current)}
            >
              <Eye size={16} />
            </button>
          </label>
          <button className="primary-button full" type="submit">
            Sign in <ArrowRight size={18} />
          </button>
        </form>
        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </div>
  )
}