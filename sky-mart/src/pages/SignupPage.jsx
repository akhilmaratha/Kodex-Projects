import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Eye, Lock, Mail, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { Logo } from '../components/Logo'
import { registerUser } from '../utils/auth'

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (name.trim().length < 2) {
      toast.error('Please enter your full name.')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    try {
      registerUser({ name, email, password })
      toast.success('Account created successfully. You are signed in now.')
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="auth-shell auth-shell-centered">
      <section className="auth-card panel auth-card-wide">
        <Logo />
        <p className="panel-title">Create account</p>
        <small>Join SkyMart and start shopping</small>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <UserRound size={16} />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="field">
            <Mail size={16} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="field">
            <Lock size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 chars)"
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
          <label className="field">
            <Lock size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>
          <button className="primary-button full" type="submit">
            Create Account <ArrowRight size={18} />
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  )
}