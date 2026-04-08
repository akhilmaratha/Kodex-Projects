import { useBlog } from '../context/useBlog.js'
import { formatBlogDate } from '../utils/blogHelpers.js'

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      {children}
    </svg>
  )
}

export function BlogCard({ blog, isActive, onEdit, onDelete, showActions = true }) {
  const { summarize } = useBlog()
  const preview = blog.excerpt?.trim() || summarize(blog.content)

  return (
    <article
      className={`rounded-3xl border bg-white/90 p-5 shadow-sm dark:bg-slate-900/80 ${
        isActive
          ? 'border-teal-500/70 ring-1 ring-teal-400/40'
          : 'border-slate-200 dark:border-slate-700'
      }`}
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

      <h3 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
        {blog.title}
      </h3>
      <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{preview}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>{blog.author}</span>
        <span>{formatBlogDate(blog.updatedAt ?? blog.createdAt)}</span>
      </div>

      {showActions ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
            type="button"
            onClick={onEdit}
          >
            <Icon>
              <path d="M4 20h4l10.5-10.5-4-4L4 16v4Zm12-14 2-2a1.5 1.5 0 0 1 2 0l2 2a1.5 1.5 0 0 1 0 2l-2 2-4-4Z" />
            </Icon>
            Edit
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-rose-500 dark:hover:text-rose-300"
            type="button"
            onClick={onDelete}
          >
            <Icon>
              <path d="M7 7h10l-1 13H8L7 7Zm3-3h4l1 2H9l1-2Zm-4 2h12v2H6V6Z" />
            </Icon>
            Delete
          </button>
        </div>
      ) : null}
    </article>
  )
}
