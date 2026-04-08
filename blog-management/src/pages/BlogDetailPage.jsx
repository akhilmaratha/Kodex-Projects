import { useBlog } from '../context/useBlog.js'
import { useRouter } from '../router/useRouter.js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { estimateReadTime, formatBlogDate } from '../utils/blogHelpers.js'

export function BlogDetailPage({ blogId }) {
  const { getBlogById } = useBlog()
  const { navigate } = useRouter()
  const blog = getBlogById(blogId)

  if (!blog) {
    return (
      <main className="mx-auto grid w-full max-w-4xl gap-5 px-4 pb-14 pt-10 md:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Not Found</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Blog not found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">The blog you opened no longer exists.</p>
          <button
            className="mt-5 inline-flex rounded-full bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400"
            type="button"
            onClick={() => navigate('/')}
          >
            Back to home
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto grid w-full max-w-4xl gap-5 px-4 pb-14 pt-10 md:px-8">
      <button
        className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
        type="button"
        onClick={() => navigate('/')}
      >
        {'< Back to Articles'}
      </button>

      <article className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 md:p-10">
        <div className="mb-5 flex flex-wrap gap-2">
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

        <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{blog.title}</h1>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>{blog.author}</span>
          <span>{formatBlogDate(blog.updatedAt ?? blog.createdAt)}</span>
          <span>{estimateReadTime(blog.content)}</span>
        </div>

        <div className="prose prose-slate mt-6 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-teal-600 dark:prose-a:text-teal-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
