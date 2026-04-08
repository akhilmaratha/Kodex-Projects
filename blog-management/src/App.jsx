import { useEffect } from 'react'
import { AuthProvider } from './context/AuthProvider.jsx'
import { BlogProvider } from './context/BlogContext.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { useAuth } from './context/useAuth.js'
import { useRouter } from './router/useRouter.js'
import { RouterProvider } from './router/RouterProvider.jsx'
import { Navbar } from './components/Navbar.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { AuthPage } from './pages/AuthPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { ArticlesPage } from './pages/ArticlesPage.jsx'
import { ArticleEditorPage } from './pages/ArticleEditorPage.jsx'
import { BlogDetailPage } from './pages/BlogDetailPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'

function matchRoute(pathname) {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return { name: 'home' }
  }

  if (segments[0] === 'login') {
    return { name: 'login' }
  }

  if (segments[0] === 'signup') {
    return { name: 'signup' }
  }

  if (segments[0] === 'dashboard') {
    return { name: 'dashboard' }
  }

  if (segments[0] === 'articles' && segments.length === 1) {
    return { name: 'articles' }
  }

  if (segments[0] === 'articles' && segments[1] === 'new') {
    return { name: 'article-create' }
  }

  if (segments[0] === 'articles' && segments[2] === 'edit') {
    return { name: 'article-edit', blogId: segments[1] }
  }

  if (segments[0] === 'blog' && segments[1]) {
    return { name: 'blog-detail', blogId: segments[1] }
  }

  return { name: 'not-found' }
}

function Redirect({ to, replace = true }) {
  const { navigate } = useRouter()

  useEffect(() => {
    navigate(to, { replace })
  }, [navigate, replace, to])

  return null
}

function AppRoutes() {
  const { pathname } = useRouter()
  const { isAuthenticated, canCreateBlogs } = useAuth()
  const route = matchRoute(pathname)
  const protectedRoutes = new Set(['dashboard', 'articles', 'article-create', 'article-edit'])
  const authRoutes = new Set(['login', 'signup'])

  if (protectedRoutes.has(route.name) && !isAuthenticated) {
    return <Redirect to="/login" />
  }

  if (authRoutes.has(route.name) && isAuthenticated) {
    return <Redirect to="/dashboard" />
  }

  if ((route.name === 'article-create' || route.name === 'article-edit') && !canCreateBlogs) {
    return <Redirect to="/articles" />
  }

  switch (route.name) {
    case 'home':
      return <HomePage />
    case 'login':
      return <AuthPage mode="login" />
    case 'signup':
      return <AuthPage mode="signup" />
    case 'dashboard':
      return <DashboardPage />
    case 'articles':
      return <ArticlesPage />
    case 'article-create':
      return <ArticleEditorPage mode="create" />
    case 'article-edit':
      return <ArticleEditorPage mode="edit" blogId={route.blogId} />
    case 'blog-detail':
      return <BlogDetailPage blogId={route.blogId} />
    default:
      return <NotFoundPage />
  }
}

function AppFrame() {
  return (
    <div className="min-h-screen text-slate-700 dark:text-slate-300">
      <Navbar />
      <AppRoutes />
    </div>
  )
}

function App() {
  return (
    <RouterProvider>
      <ThemeProvider>
        <AuthProvider>
          <BlogProvider>
            <AppFrame />
          </BlogProvider>
        </AuthProvider>
      </ThemeProvider>
    </RouterProvider>
  )
}

export default App
