import { NavLink, useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material'
import { useAuth } from '../../auth/AuthContext.jsx'

const tabs = [
  { label: 'Dashboard', to: '/', className: 'dashboard' },
  { label: 'Usuarios', to: '/usuarios', className: 'users', permission: 'MANAGE_USERS' },
  { label: 'Ejercicios', to: '/ejercicios', className: 'exercises', permission: 'VIEW_EXERCISE' },
  { label: 'Permisos', to: '/permisos', className: 'permisos', permission: 'MANAGE_PERMISSIONS' }
]

export default function Navbar() {
  const navigate = useNavigate()
  const { session, logout, hasPermission } = useAuth()
  const visibleTabs = tabs.filter((tab) => hasPermission(tab.permission))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
      <header className="topbar app-topbar">
        <Stack
            direction="row"
            spacing={1}
            className="nav-tabs"
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
        >
          {visibleTabs.map((tab) => (
              <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === '/'}
                  className={({ isActive }) => `tab ${tab.className}${isActive ? ' active' : ''}`}
              >
                {tab.label}
              </NavLink>
          ))}
        </Stack>

        <Box className="user-box">
          <Avatar className="avatar" sx={{ width: 38, height: 38 }}>
            {session?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight={800}>{session?.fullName || 'Usuario'}</Typography>
            <Typography variant="caption" color="text.secondary">{session?.email}</Typography>
          </Box>
          <IconButton onClick={handleLogout} className="logout-icon" title="Cerrar sesión">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </header>
  )
}