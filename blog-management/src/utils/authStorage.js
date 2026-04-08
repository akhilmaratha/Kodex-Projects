const USERS_KEY = 'inkwell.users'
const CURRENT_USER_KEY = 'inkwell.currentUser'

export function loadUsers(fallbackUsers = []) {
  if (typeof window === 'undefined') {
    return fallbackUsers
  }

  try {
    const value = window.localStorage.getItem(USERS_KEY)

    if (!value) {
      return fallbackUsers
    }

    const parsed = JSON.parse(value)

    return Array.isArray(parsed) ? parsed : fallbackUsers
  } catch {
    return fallbackUsers
  }
}

export function saveUsers(users) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadCurrentUser() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.localStorage.getItem(CURRENT_USER_KEY)

    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function saveCurrentUser(user) {
  if (typeof window === 'undefined') {
    return
  }

  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY)
    return
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}
