import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './themeContext.js'
import { loadTheme, saveTheme } from '../utils/themeStorage.js'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => loadTheme())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme: setThemeState,
      toggleTheme() {
        setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
