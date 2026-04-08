import { BlogForm } from '../components/BlogForm.jsx'
import { useBlog } from '../context/useBlog.js'
import { useRouter } from '../router/useRouter.js'

export function ArticleEditorPage({ blogId, mode }) {
  const { getBlogById } = useBlog()
  const { navigate } = useRouter()
  const blog = blogId ? getBlogById(blogId) : null

  if (blogId && !blog) {
    return (
      <main className="mx-auto grid w-full max-w-4xl gap-6 px-4 pb-14 pt-8 md:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Article not found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">The requested article does not exist anymore.</p>
          <button
            className="mt-5 inline-flex rounded-full bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400"
            type="button"
            onClick={() => navigate('/articles')}
          >
            Back to articles
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto grid w-full max-w-4xl gap-6 px-4 pb-14 pt-8 md:px-8">
      <section className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">
              {mode === 'edit' ? 'Edit article' : 'Create article'}
            </p>
            <h1 className="mt-1 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {mode === 'edit' ? 'Update your post' : 'Write a new post'}
            </h1>
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
            type="button"
            onClick={() => navigate('/articles')}
          >
            Back to articles
          </button>
        </div>

        <BlogForm
          key={blogId || 'new'}
          blogId={blogId}
          onSuccess={() => navigate('/articles')}
        />
      </section>
    </main>
  )
}
