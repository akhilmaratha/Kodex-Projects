const THEME_KEY = 'inkwell.theme'

export function loadTheme(fallbackTheme = 'dark') {
  if (typeof window === 'undefined') {
    return fallbackTheme
  }

  const storedTheme = window.localStorage.getItem(THEME_KEY)

  return storedTheme === 'light' ? 'light' : storedTheme === 'dark' ? 'dark' : fallbackTheme
}

export function saveTheme(theme) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(THEME_KEY, theme)
}
