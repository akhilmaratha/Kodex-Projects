import { useState } from 'react'
import { useAuth } from '../context/useAuth.js'
import { useRouter } from '../router/useRouter.js'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  accountType: 'reader',
}

export function AuthPage({ mode }) {
  const { login, signup } = useAuth()
  const { navigate } = useRouter()
  const [formState, setFormState] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormState((currentState) => ({ ...currentState, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (mode === 'signup' && formState.password !== formState.confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    const response =
      mode === 'signup'
        ? signup({
            name: formState.name,
            email: formState.email,
            password: formState.password,
            accountType: formState.accountType,
          })
        : login({
            email: formState.email,
            password: formState.password,
          })

    if (!response.ok) {
      setErrorMessage(response.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-xl place-items-center px-4 py-10">
      <section className="w-full rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40" aria-hidden="true">
          <svg viewBox="0 0 32 32" className="h-8 w-8 fill-none stroke-teal-500 stroke-[2.4] [stroke-linecap:round] [stroke-linejoin:round]">
            <path d="M7 24.5 24.5 7c1.2-1.2 3.2-1.2 4.4 0s1.2 3.2 0 4.4L11.4 28.4 5 30l1.6-6.4Z" />
          </svg>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {mode === 'signup' ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-slate-600 dark:text-slate-300">
          {mode === 'signup'
            ? 'Join Inkwell to save your articles, tasks, and theme locally.'
            : 'Sign in to continue to your dashboard and saved content.'}
        </p>

        <form className="mt-5 grid gap-4 text-left" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              Name
              <input
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </label>
          )}

          <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            Email
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            Password
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
              required
            />
          </label>

          {mode === 'signup' && (
            <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              Confirm Password
              <input
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                name="confirmPassword"
                type="password"
                value={formState.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </label>
          )}

          {mode === 'signup' && (
            <fieldset className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <legend className="mb-1 font-medium text-slate-800 dark:text-slate-100">Account Type</legend>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormState((currentState) => ({ ...currentState, accountType: 'reader' }))
                  }
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    formState.accountType === 'reader'
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  <p className="font-semibold">Reader</p>
                  <p className="text-xs opacity-80">Read articles</p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormState((currentState) => ({ ...currentState, accountType: 'author' }))
                  }
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    formState.accountType === 'author'
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  <p className="font-semibold">Author</p>
                  <p className="text-xs opacity-80">Write and publish</p>
                </button>
              </div>
            </fieldset>
          )}

          {errorMessage && <p className="text-sm text-rose-500">{errorMessage}</p>}

          <button
            className="inline-flex items-center justify-center rounded-full bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400"
            type="submit"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button
          className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
          type="button"
          onClick={() => navigate(mode === 'signup' ? '/login' : '/signup', { replace: true })}
        >
          {mode === 'signup' ? 'Already have an account? Login' : "Need an account? Sign up"}
        </button>
      </section>
    </main>
  )
}
