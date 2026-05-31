import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loginService, logoutService } from '../services/authService.js'

export const AuthContext = createContext(null)

function readStoredSession() {
  const raw = localStorage.getItem('fitcampus_session') || localStorage.getItem('user')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    logoutService()
    return null
  }
}

function normalizeSession(data) {
  const token = data?.accessToken || data?.token
  if (!token) {
    throw new Error('El backend no envió un token JWT válido.')
  }

  return {
    ...data,
    accessToken: token,
    tokenType: data?.tokenType || 'Bearer',
    fullName: data?.fullName || data?.username || data?.email || 'Usuario',
    roles: data?.roles || [],
    authorities: data?.authorities || data?.permissions || []
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession)

  const login = useCallback(async (email, password) => {
    const data = await loginService(email, password)
    const normalized = normalizeSession(data)

    localStorage.setItem('fitcampus_session', JSON.stringify(normalized))
    localStorage.setItem('token', normalized.accessToken)
    localStorage.setItem('user', JSON.stringify(normalized))
    setSession(normalized)

    return normalized
  }, [])

  const logout = useCallback(() => {
    logoutService()
    setSession(null)
  }, [])

  const hasPermission = useCallback((permission) => {
    if (!permission) return true
    return session?.authorities?.includes(permission) || session?.roles?.includes(permission) || false
  }, [session])

  const hasAnyPermission = useCallback((permissions = []) => {
    if (!permissions.length) return true
    return permissions.some((permission) => hasPermission(permission))
  }, [hasPermission])

  useEffect(() => {
    const handler = () => setSession(null)
    window.addEventListener('fitcampus:logout', handler)
    return () => window.removeEventListener('fitcampus:logout', handler)
  }, [])

  const value = useMemo(() => ({
    user: session,
    session,
    login,
    logout,
    isAuthenticated: Boolean(session?.accessToken),
    hasPermission,
    hasAuthority: hasPermission,
    hasAnyPermission
  }), [session, login, logout, hasPermission, hasAnyPermission])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
