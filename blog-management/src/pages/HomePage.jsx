import { useBlog } from '../context/useBlog.js'
import { useRouter } from '../router/useRouter.js'
import { formatBlogDate } from '../utils/blogHelpers.js'

export function HomePage() {
  const { blogs } = useBlog()
  const { navigate } = useRouter()
  const featuredBlogs = blogs

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 pt-10 md:px-8">
      <section className="py-4 text-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-7xl dark:text-slate-100">
          Welcome to <span>Inkwell</span>
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Discover thoughtful articles on technology, programming, and software
          engineering from passionate writers.
        </p>
      </section>

      <section className="grid gap-4">
        <header className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Latest Articles</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">{blogs.length} articles</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredBlogs.map((blog) => (
            <button
              key={blog.id}
              className="rounded-3xl border border-slate-200 bg-white/90 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-teal-500"
              type="button"
              onClick={() => navigate(`/blog/${blog.id}`)}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-teal-300 bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:border-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  {blog.category}
                </span>
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                {blog.title}
              </h3>
              <p className="mt-3 line-clamp-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                {blog.excerpt || blog.content}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>{blog.author}</span>
                <span>{formatBlogDate(blog.updatedAt ?? blog.createdAt)}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {blogs.length === 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">No articles yet</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Create one from the New page.</p>
        </section>
      ) : null}
    </main>
  )
}
