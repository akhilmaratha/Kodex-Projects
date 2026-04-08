import { BlogCard } from '../components/BlogCard.jsx'
import { useBlog } from '../context/useBlog.js'
import { useAuth } from '../context/useAuth.js'
import { useRouter } from '../router/useRouter.js'

export function ArticlesPage() {
  const { blogs, deleteBlog } = useBlog()
  const { canCreateBlogs } = useAuth()
  const { navigate } = useRouter()

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-7 px-4 pb-14 pt-8 md:px-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Articles</p>
          <h1 className="mt-1 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">All articles</h1>
        </div>
        {canCreateBlogs ? (
          <button
            className="inline-flex items-center rounded-full bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400"
            type="button"
            onClick={() => navigate('/articles/new')}
          >
            Create article
          </button>
        ) : null}
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {blogs.map((blog) => (
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

      {blogs.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">No articles yet</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Create one from the button above.</p>
        </div>
      )}
    </main>
  )
}
