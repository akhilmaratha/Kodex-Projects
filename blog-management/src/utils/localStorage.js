const STORAGE_KEY = 'inkwell.blogs'

export function loadBlogs(fallbackBlogs) {
  if (typeof window === 'undefined') {
    return fallbackBlogs
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return fallbackBlogs
    }

    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
      return fallbackBlogs
    }

    return parsedValue
  } catch {
    return fallbackBlogs
  }
}

export function saveBlogs(blogs) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs))
}
