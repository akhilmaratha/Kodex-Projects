import { useAuth } from '../context/useAuth.js'
import { useRouter } from '../router/useRouter.js'
import { useTheme } from '../context/useTheme.js'

function LogoMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-8 w-8 fill-none stroke-teal-500 stroke-[2.4] [stroke-linecap:round] [stroke-linejoin:round]"
    >
      <path d="M7 24.5 24.5 7c1.2-1.2 3.2-1.2 4.4 0s1.2 3.2 0 4.4L11.4 28.4 5 30l1.6-6.4Z" />
    </svg>
  )
}

export function Navbar() {
  const { currentUser, logout, isAuthenticated, canCreateBlogs } = useAuth()
  const { pathname, navigate } = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isFrontPage = pathname === '/'

  const navItems = isAuthenticated
    ? [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Articles', to: '/articles' },
        ...(canCreateBlogs ? [{ label: 'New', to: '/articles/new' }] : []),
      ]
    : [
        { label: 'Home', to: '/' },
        { label: 'Login', to: '/login' },
        { label: 'Sign Up', to: '/signup' },
      ]

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-4 py-4 backdrop-blur md:px-8 dark:border-slate-700/70 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <button
          className="inline-flex items-center gap-3 text-left"
          type="button"
          onClick={() => navigate('/')}
        >
        <LogoMark />
        <div>
          <strong className="block text-xl text-slate-900 dark:text-slate-100">Inkwell</strong>
          {isFrontPage ? null : (
            <span className="text-xs text-slate-500 dark:text-slate-400">Blog and task manager</span>
          )}
        </div>
      </button>

      <nav className="flex flex-wrap items-center justify-end gap-2" aria-label="Primary">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
          type="button"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☾' : '☀'}
        </button>

        {isFrontPage && isAuthenticated ? (
          <button
            className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-teal-500 dark:hover:text-teal-300"
            type="button"
            onClick={() => navigate('/dashboard')}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 font-bold text-slate-950">
              {currentUser?.name?.slice(0, 1)?.toUpperCase() || 'U'}
            </span>
            {currentUser?.name || 'User'}
          </button>
        ) : (
          <>
            {navItems.map((item) => (
              <button
                key={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  pathname === item.to
                    ? 'bg-teal-500 text-slate-950'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100'
                }`}
                type="button"
                onClick={() => navigate(item.to)}
              >
                {item.label}
              </button>
            ))}

            {isAuthenticated ? (
              <button
                className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-rose-500 dark:hover:text-rose-300"
                type="button"
                onClick={logout}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 font-bold text-slate-950">
                  {currentUser?.name?.slice(0, 1)?.toUpperCase() || 'U'}
                </span>
                Logout
              </button>
            ) : null}
          </>
        )}
      </nav>
      </div>
    </header>
  )
}
