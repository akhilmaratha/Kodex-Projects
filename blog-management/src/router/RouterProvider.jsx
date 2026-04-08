import { useEffect, useMemo, useState } from 'react'
import { RouterContext } from './routerContext.js'

function getPathname() {
  return window.location.pathname || '/'
}

export function RouterProvider({ children }) {
  const [pathname, setPathname] = useState(() => {
    if (typeof window === 'undefined') {
      return '/'
    }

    return getPathname()
  })

  useEffect(() => {
    function handlePopState() {
      setPathname(getPathname())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const value = useMemo(
    () => ({
      pathname,
      navigate(to, options = {}) {
        if (options.replace) {
          window.history.replaceState({}, '', to)
        } else {
          window.history.pushState({}, '', to)
        }

        setPathname(to)
      },
    }),
    [pathname],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}
