import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Decor from '../components/Decor/Decor.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'

export default function DashboardLayout() {
  return (
    <Box className="dashboard-shell">
      <Decor />
      <main className="page-wrapper">
        <Navbar />
        <Outlet />
      </main>
    </Box>
  )
}
