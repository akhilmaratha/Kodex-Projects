import { useState } from 'react'
import { useBlog } from '../context/useBlog.js'
import { parseTagInput, serializeTags } from '../utils/blogHelpers.js'

const accentOptions = [
  { value: 'teal', label: 'Teal' },
  { value: 'slate', label: 'Slate' },
  { value: 'amber', label: 'Amber' },
  { value: 'rose', label: 'Rose' },
]

const defaultForm = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  category: '',
  tags: 'React, UI',
  accent: 'teal', 
}

function createFormState(blog) {
  if (!blog) {
    return defaultForm
  }

  return {
    title: blog.title,
    excerpt: blog.excerpt || '',
    content: blog.content,
    author: blog.author,
    category: blog.category,
    tags: serializeTags(blog.tags),
    accent: blog.accent,
  }
}

export function BlogForm({ blogId, onSuccess }) {
  const { getBlogById, upsertBlog } = useBlog()
  const activeBlog = blogId ? getBlogById(blogId) : null
  const [formState, setFormState] = useState(() => createFormState(activeBlog))

  function handleChange(event) {
    const { name, value } = event.target
    setFormState((currentState) => ({ ...currentState, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const submitMode = event.nativeEvent?.submitter?.value || 'published'

    const tags = parseTagInput(formState.tags)

    upsertBlog(
      {
        title: formState.title,
        excerpt: formState.excerpt,
        content: formState.content,
        author: formState.author,
        category: formState.category,
        tags: tags.length > 0 ? tags : ['General'],
        accent: formState.accent,
        status: submitMode,
      },
      blogId,
    )

    if (!blogId) {
      setFormState(defaultForm)
    }

    if (onSuccess) {
      onSuccess()
    }
  }

  if (blogId && !activeBlog) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Article not found</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">This article no longer exists.</p>
      </section>
    )
  }

  const isEditing = Boolean(blogId)

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Composer</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {isEditing ? 'Edit article' : 'Create article'}
          </h2>
        </div>
        {isEditing ? (
          <span className="text-sm text-slate-500 dark:text-slate-400">Editing saved article</span>
        ) : (
          <span className="text-sm text-slate-500 dark:text-slate-400">New content</span>
        )}
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          Title
          <input
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Write a strong headline"
            required
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          Excerpt
          <textarea
            name="excerpt"
            value={formState.excerpt}
            onChange={handleChange}
            placeholder="Write a brief summary of your article..."
            rows="3"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            A short description that appears on the blog listing.
          </span>
        </label>

        <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          Content
          <textarea
            name="content"
            value={formState.content}
            onChange={handleChange}
            placeholder="Write your article content here... (Markdown supported)"
            rows="8"
            required
            className="min-h-44 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Supports Markdown: # for headers, **bold**, *italic*, `code`, etc.
          </span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            Author
            <input
              name="author"
              value={formState.author}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            Category
            <input
              name="category"
              value={formState.category}
              onChange={handleChange}
              placeholder="React, Design, Backend"
              required
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            Tags
            <input
              name="tags"
              value={formState.tags}
              onChange={handleChange}
              placeholder="Add tags (press Enter to add)"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Add up to 5 tags to help readers find your article.
            </span>
          </label>

          <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            Accent
            <select
              name="accent"
              value={formState.accent}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {accentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
          <button
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            type="submit"
            value="draft"
          >
            Save as Draft
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400"
            type="submit"
            value="published"
          >
            {isEditing ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </form>
    </section>
  )
}
