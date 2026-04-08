import { BlogCard } from '../components/BlogCard.jsx'
import { useBlog } from '../context/useBlog.js'
import { useAuth } from '../context/useAuth.js'
import { useRouter } from '../router/useRouter.js'

export function DashboardPage() {
  const { blogs, stats, deleteBlog } = useBlog()
  const { currentUser, canCreateBlogs } = useAuth()
  const { navigate } = useRouter()
  const recentBlogs = blogs

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-7 px-4 pb-14 pt-8 md:px-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Dashboard</p>
          <h1 className="mt-1 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome back, {currentUser?.name || 'creator'}.
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
            Manage your articles from dedicated routes. Nothing is crammed onto the home page.
          </p>
        </div>
        {canCreateBlogs ? (
          <button
            className="inline-flex items-center rounded-full bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400"
            type="button"
            onClick={() => navigate('/articles/new')}
          >
            + New Article
          </button>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <span className="text-sm text-slate-500 dark:text-slate-400">Total Articles</span>
          <strong className="mt-3 block text-5xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</strong>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <span className="text-sm text-slate-500 dark:text-slate-400">Categories</span>
          <strong className="mt-3 block text-5xl font-bold text-slate-900 dark:text-slate-100">{stats.categories}</strong>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <span className="text-sm text-slate-500 dark:text-slate-400">Recent</span>
          <strong className="mt-3 block text-5xl font-bold text-slate-900 dark:text-slate-100">{stats.recent}</strong>
        </article>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Your latest articles</h2>
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
            type="button"
            onClick={() => navigate('/articles')}
          >
            View all
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isActive={false}
              showActions={canCreateBlogs}
              onEdit={() => navigate(`/articles/${blog.id}/edit`)}
              onDelete={() => deleteBlog(blog.id)}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
