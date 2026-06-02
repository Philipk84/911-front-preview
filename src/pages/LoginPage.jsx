import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import Decor from '../components/Decor/Decor.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { getErrorMessage } from '../utils/formatters.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAuth()
  const [email, setEmail] = useState('hernando.ospina@fitcampus.co')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'login'))
    } finally {
      setLoading(false)
    }
  }

  return (
      <Box className="login-page">
        <Decor variant="login" />
        <Box component="form" className="login-form" onSubmit={handleSubmit}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <span className="login-lock"><LockOutlinedIcon /></span>
            <Typography className="title" component="h1">FitCampus</Typography>
            <Typography className="login-subtitle">Inicia sesión para administrar el sistema</Typography>
            <Typography className="login-helper">Usa el correo completo, no el usuario corto. Ejemplo: hernando.ospina@fitcampus.co</Typography>
          </Stack>

          <label htmlFor="email">Correo</label>
          <TextField
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
          />

          <label htmlFor="password">Contraseña</label>
          <TextField
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
          />

          {error && <Alert severity="error" sx={{ width: 'min(420px, 100%)' }}>{error}</Alert>}

          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? 'Validando...' : 'Entrar'}
          </Button>

        </Box>
      </Box>
  )
}