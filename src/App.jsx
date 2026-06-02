import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import EntityPage from './pages/EntityPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { entityConfigs } from './config/entities.js'

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

const basename = import.meta.env.VITE_ROUTER_BASENAME || '/iaslab/compu2/911'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '/', element: <DashboardPage /> },
          ...entityConfigs.map((config) => ({
            path: config.route.replace(/^\//, ''),
            element: (
                <ProtectedRoute permission={config.requiredPermission}>
                  <EntityPage config={config} />
                </ProtectedRoute>
            )
          }))
        ]
      },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
], { basename })

export default function App() {
  return <RouterProvider router={router} />
}
