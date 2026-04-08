import { useEffect, useMemo, useState } from 'react'
import { BlogContext } from './blogContext.js'
import { loadBlogs, saveBlogs } from '../utils/localStorage.js'
import { normalizeStatus, resolveExcerpt, summarizeText } from '../utils/blogHelpers.js'

const seedBlogs = [
  {
    id: 'seed-1',
    title: 'Getting Started with React Hooks',
    excerpt: 'Learn how React hooks simplify state management and make components more reusable.',
    content:
      '## Why Hooks?\n\nReact Hooks revolutionized how we write components.\n\n### useState\n\n`useState` lets you add local state without class components.',
    author: 'Sarah Chen',
    category: 'React',
    tags: ['JavaScript', 'Web Development'],
    accent: 'teal',
    status: 'published',
    createdAt: '2024-01-15T09:30:00.000Z',
    updatedAt: '2024-01-15T09:30:00.000Z',
  },
  {
    id: 'seed-2',
    title: 'Building Scalable APIs with Node.js',
    excerpt: 'Best practices for building robust and scalable REST APIs with Express.',
    content:
      '## API Design\n\nUse consistent route naming and status codes.\n\n- Validate input\n- Handle errors centrally\n- Write integration tests',
    author: 'Sarah Chen',
    category: 'Backend',
    tags: ['Node.js', 'API'],
    accent: 'slate',
    status: 'published',
    createdAt: '2024-01-20T11:00:00.000Z',
    updatedAt: '2024-01-20T11:00:00.000Z',
  },
  {
    id: 'seed-3',
    title: 'Designing Task Systems That Scale',
    excerpt: 'A practical guide to organizing task workflows without backend complexity.',
    content:
      '## Task Architecture\n\nBreak down work into simple flows and clear priorities.',
    author: 'Mina Patel',
    category: 'Productivity',
    tags: ['Planning', 'UI'],
    accent: 'amber',
    status: 'published',
    createdAt: '2024-02-02T14:15:00.000Z',
    updatedAt: '2024-02-02T14:15:00.000Z',
  },
  {
    id: 'seed-4',
    title: 'Why LocalStorage Still Matters',
    excerpt: 'When you need lightweight persistence, browser storage is still a strong option.',
    content:
      '## Lightweight Persistence\n\nLocalStorage is great for prototypes and offline-friendly UIs.',
    author: 'Avery Brooks',
    category: 'Frontend',
    tags: ['Storage', 'UX'],
    accent: 'rose',
    status: 'published',
    createdAt: '2024-03-12T08:45:00.000Z',
    updatedAt: '2024-03-12T08:45:00.000Z',
  },
]

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `blog-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function summarize(text) {
  return summarizeText(text, 120)
}

function normalizeBlog(blog) {
  return {
    ...blog,
    excerpt: resolveExcerpt(blog.excerpt, blog.content),
    status: normalizeStatus(blog.status),
    tags: Array.isArray(blog.tags) ? blog.tags : [],
  }
}

function toBlogPayload(input, timestamp) {
  return {
    title: input.title.trim(),
    excerpt: resolveExcerpt(input.excerpt, input.content),
    content: input.content.trim(),
    author: input.author.trim(),
    category: input.category.trim(),
    tags: input.tags,
    accent: input.accent,
    status: normalizeStatus(input.status),
    updatedAt: timestamp,
  }
}

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState(() => loadBlogs(seedBlogs).map(normalizeBlog))
  const [selectedBlogId, setSelectedBlogId] = useState(null)

  useEffect(() => {
    saveBlogs(blogs)
  }, [blogs])

  const selectedBlog = useMemo(
    () => blogs.find((blog) => blog.id === selectedBlogId) ?? null,
    [blogs, selectedBlogId],
  )

  const stats = useMemo(() => {
    const categories = new Set(blogs.map((blog) => blog.category).filter(Boolean))
    const now = new Date().getTime()
    const recent = blogs.filter((blog) => {
      const createdAt = new Date(blog.createdAt).getTime()
      return Number.isFinite(createdAt) && now - createdAt < 1000 * 60 * 60 * 24 * 30
    }).length

    return {
      total: blogs.length,
      categories: categories.size,
      recent,
    }
  }, [blogs])

  function selectBlog(blogId) {
    setSelectedBlogId(blogId)
  }

  function clearSelection() {
    setSelectedBlogId(null)
  }

  function addBlog(input) {
    const timestamp = new Date().toISOString()
    const nextBlog = {
      id: createId(),
      ...toBlogPayload(input, timestamp),
      createdAt: timestamp,
    }

    setBlogs((currentBlogs) => [nextBlog, ...currentBlogs])
    setSelectedBlogId(nextBlog.id)
  }

  function updateBlog(blogId, input) {
    const timestamp = new Date().toISOString()

    setBlogs((currentBlogs) =>
      currentBlogs.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              ...toBlogPayload(input, timestamp),
            }
          : blog,
      ),
    )
  }

  function deleteBlog(blogId) {
    setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog.id !== blogId))
    setSelectedBlogId((currentSelectedId) =>
      currentSelectedId === blogId ? null : currentSelectedId,
    )
  }

  function upsertBlog(input, blogId) {
    if (blogId) {
      updateBlog(blogId, input)
      return blogId
    }

    addBlog(input)
    return null
  }

  const value = {
    blogs,
    selectedBlog,
    selectedBlogId,
    stats,
    getBlogById(blogId) {
      return blogs.find((blog) => blog.id === blogId) ?? null
    },
    seedBlogs,
    selectBlog,
    clearSelection,
    addBlog,
    updateBlog,
    deleteBlog,
    upsertBlog,
    resetDemoData() {
      setBlogs(seedBlogs.map(normalizeBlog))
      setSelectedBlogId(null)
    },
    summarize,
  }

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
}
