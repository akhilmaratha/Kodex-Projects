const AUTH_USERS_KEY = 'skymart_users'
const AUTH_CURRENT_USER_KEY = 'skymart_current_user'

function readJson(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  const storedValue = window.localStorage.getItem(key)
  if (!storedValue) {
    return fallback
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function ensureUsers() {
  const users = readJson(AUTH_USERS_KEY, null)
  if (Array.isArray(users) && users.length > 0) {
    return users
  }

  writeJson(AUTH_USERS_KEY, [])
  return []
}

export function getCurrentUser() {
  return readJson(AUTH_CURRENT_USER_KEY, null)
}

export function registerUser({ name, email, password }) {
  const users = ensureUsers()
  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }

  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password,
  }

  writeJson(AUTH_USERS_KEY, [...users, newUser])
  writeJson(AUTH_CURRENT_USER_KEY, { name: newUser.name, email: newUser.email })

  return { name: newUser.name, email: newUser.email }
}

export function loginUser({ email, password }) {
  const users = ensureUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const matchedUser = users.find(
    (user) => user.email === normalizedEmail && user.password === password,
  )

  if (!matchedUser) {
    throw new Error('Invalid email or password.')
  }

  const sessionUser = { name: matchedUser.name, email: matchedUser.email }
  writeJson(AUTH_CURRENT_USER_KEY, sessionUser)

  return sessionUser
}

export function logoutUser() {
  window.localStorage.removeItem(AUTH_CURRENT_USER_KEY)
}