import { useAuthContext } from './useAuthContext.js'

const usePermission = (permission) => {
  const { hasPermission } = useAuthContext()
  if (!permission) return true
  return hasPermission(permission)
}

export { usePermission }
