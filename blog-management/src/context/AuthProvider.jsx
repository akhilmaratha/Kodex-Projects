import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'
import { loadCurrentUser, loadUsers, saveCurrentUser, saveUsers } from '../utils/authStorage.js'

function createUserId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `user-${Date.now()}`
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers())
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser())

  useEffect(() => {
    saveUsers(users)
  }, [users])

  useEffect(() => {
    saveCurrentUser(currentUser)
  }, [currentUser])

  const value = useMemo(() => {
    function signup({ name, email, password, accountType }) {
      const normalizedEmail = email.trim().toLowerCase()

      if (users.some((user) => user.email === normalizedEmail)) {
        return { ok: false, message: 'An account with this email already exists.' }
      }

      const nextUser = {
        id: createUserId(),
        name: name.trim(),
        email: normalizedEmail,
        password,
        accountType: accountType === 'reader' ? 'reader' : 'author',
        createdAt: new Date().toISOString(),
      }

      setUsers((currentUsers) => [nextUser, ...currentUsers])
      setCurrentUser({
        id: nextUser.id,
        name: nextUser.name,
        email: nextUser.email,
        accountType: nextUser.accountType,
      })

      return { ok: true, user: nextUser }
    }

    function login({ email, password }) {
      const normalizedEmail = email.trim().toLowerCase()
      const matchedUser = users.find(
        (user) => user.email === normalizedEmail && user.password === password,
      )

      if (!matchedUser) {
        return { ok: false, message: 'Invalid email or password.' }
      }

      setCurrentUser({
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        accountType: matchedUser.accountType || 'author',
      })

      return { ok: true, user: matchedUser }
    }

    function logout() {
      setCurrentUser(null)
    }

    const normalizedCurrentUser = currentUser
      ? {
          ...currentUser,
          accountType: currentUser.accountType || 'author',
        }
      : null

    return {
      users,
      currentUser: normalizedCurrentUser,
      isAuthenticated: Boolean(normalizedCurrentUser),
      canCreateBlogs: normalizedCurrentUser?.accountType === 'author',
      signup,
      login,
      logout,
    }
  }, [currentUser, users])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
