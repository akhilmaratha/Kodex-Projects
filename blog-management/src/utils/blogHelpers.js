export function formatBlogDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function estimateReadTime(markdownText) {
  const wordCount = markdownText.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / 200))
  return `${minutes} min read`
}

export function summarizeText(text, maxLength = 120) {
  return text.trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

export function parseTagInput(input, maxTags = 5) {
  const tags = input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  return [...new Set(tags)].slice(0, maxTags)
}

export function serializeTags(tags) {
  return Array.isArray(tags) ? tags.join(', ') : ''
}

export function resolveExcerpt(excerpt, content) {
  const cleanedExcerpt = (excerpt || '').trim()

  if (cleanedExcerpt) {
    return cleanedExcerpt
  }

  return summarizeText(content || '', 180)
}

export function normalizeStatus(value) {
  return value === 'draft' ? 'draft' : 'published'
}