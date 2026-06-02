import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import InsightsIcon from '@mui/icons-material/Insights'
import PeopleIcon from '@mui/icons-material/People'
import SecurityIcon from '@mui/icons-material/Security'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import { Alert, Box, Chip, Stack, Typography } from '@mui/material'
import { entityConfigs } from '../config/entities.js'
import { listItems } from '../services/entityService.js'
import { useAuth } from '../auth/AuthContext.jsx'

const iconMap = {
  users: <PeopleIcon />,
  roles: <SecurityIcon />,
  events: <EventIcon />,
  routines: <FitnessCenterIcon />,
  exercises: <FitnessCenterIcon />,
  progressrecords: <InsightsIcon />,
  visualsupports: <VideoLibraryIcon />
}

export default function DashboardPage() {
  const auth = useAuth()
  const [counts, setCounts] = useState({})

  const visibleEntities = useMemo(
      () => entityConfigs.filter((config) => auth.hasPermission(config.requiredPermission)),
      [auth]
  )

  const featured = useMemo(() => {
    const keys = ['users', 'roles', 'events', 'routines', 'exercises', 'progressrecords']
    return visibleEntities.filter((config) => keys.includes(config.key)).slice(0, 6)
  }, [visibleEntities])

  useEffect(() => {
    let mounted = true

    async function loadCounts() {
      const result = {}

      for (const config of featured) {
        try {
          const rows = await listItems(config.endpoint)
          result[config.key] = rows.length
        } catch {
          result[config.key] = '—'
        }
      }

      if (mounted) setCounts(result)
    }

    loadCounts()

    return () => {
      mounted = false
    }
  }, [featured])

  return (
      <Box className="page-fade">
        <section className="hero-card">
          <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between'
              }}
          >
            <Box>
              <Typography variant="h4" component="h1">Panel FitCampus</Typography>
              <Typography variant="body2" color="text.secondary">
                Administra usuarios, rutinas, ejercicios, eventos y progreso desde una SPA conectada al API REST.
              </Typography>
            </Box>
          </Stack>
        </section>

        <section className="cards-grid">
          {featured.map((config) => (
              <Link key={config.key} to={config.route} className="dashboard-card">
                <Stack
                    direction="row"
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                >
                  <span className="card-icon">{iconMap[config.key] || <FitnessCenterIcon />}</span>
                  <span className="card-count">{counts[config.key] ?? '...'}</span>
                </Stack>

                <Box>
                  <Typography variant="h6">{config.title}</Typography>
                  <Typography variant="body2">Gestionar {config.singular}s desde el API REST.</Typography>
                </Box>
              </Link>
          ))}
        </section>

        <section className="quick-panel">
          <Typography variant="h6">Módulos disponibles</Typography>

          <Box className="module-chip-grid">
            {visibleEntities.map((config) => (
                <Chip
                    key={config.key}
                    component={Link}
                    to={config.route}
                    clickable
                    label={config.title}
                    className="pastel-chip module-chip"
                />
            ))}
          </Box>
        </section>

        <Alert severity="info" className="pastel-alert">
          El menú respeta los permisos que llegan en el token. Si un módulo no aparece, revisa los authorities del usuario autenticado.
        </Alert>
      </Box>
  )
}