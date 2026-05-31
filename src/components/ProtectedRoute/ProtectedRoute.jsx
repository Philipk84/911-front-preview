import { Navigate, useLocation } from 'react-router-dom'
import { Alert, Box } from '@mui/material'
import { useAuth } from '../../auth/AuthContext.jsx'

export default function ProtectedRoute({ children, permission }) {
  const location = useLocation()
  const { isAuthenticated, hasPermission } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!hasPermission(permission)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No tienes permisos para entrar a esta sección.</Alert>
      </Box>
    )
  }

  return children
}
