import { useCallback, useEffect, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import ConfirmDialog from '../components/Entity/ConfirmDialog.jsx'
import EntityFormDialog from '../components/Entity/EntityFormDialog.jsx'
import EntityRow from '../components/Entity/EntityRow.jsx'
import JsonDialog from '../components/Entity/JsonDialog.jsx'
import { createItem, deleteItem, listItems, updateItem } from '../services/entityService.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { expandOptions, getErrorMessage, getRowKey } from '../utils/formatters.js'

function rowMatches(row, query) {
  if (!query.trim()) return true
  const text = JSON.stringify(row).toLowerCase()
  return text.includes(query.trim().toLowerCase())
}

function optionFields(config) {
  const candidates = [...(config.fields || []), ...(config.columns || [])]
  const unique = new Map()

  candidates
      .filter((field) => field.optionsEndpoint)
      .forEach((field) => unique.set(field.name, field))

  return Array.from(unique.values())
}

function buildRelationMaps(config, optionsByEndpoint) {
  return optionFields(config).reduce((maps, field) => {
    const options = optionsByEndpoint[field.optionsEndpoint] || []
    const expanded = expandOptions(options, field)

    maps[field.name] = new Map(
        expanded.map((option) => [option.value, option.label])
    )

    return maps
  }, {})
}

export default function EntityPage({ config }) {
  const auth = useAuth()
  const [rows, setRows] = useState([])
  const [optionsByEndpoint, setOptionsByEndpoint] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [jsonItem, setJsonItem] = useState(null)

  const canView = auth.hasPermission(config.requiredPermission)
  const canCreate = auth.hasPermission(config.createPermission || config.requiredPermission)
  const canEdit = auth.hasPermission(config.editPermission || config.requiredPermission)
  const canDelete = auth.hasPermission(config.deletePermission || config.requiredPermission)

  const loadOptions = useCallback(async () => {
    const nextOptions = {}

    for (const field of optionFields(config)) {
      try {
        nextOptions[field.optionsEndpoint] = await listItems(field.optionsEndpoint)
      } catch {
        nextOptions[field.optionsEndpoint] = []
      }
    }

    setOptionsByEndpoint(nextOptions)
  }, [config])

  const loadRows = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listItems(config.endpoint)
      setRows(data)
      await loadOptions()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [config.endpoint, loadOptions])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const filteredRows = useMemo(() => rows.filter((row) => rowMatches(row, search)), [rows, search])
  const maps = useMemo(() => buildRelationMaps(config, optionsByEndpoint), [config, optionsByEndpoint])

  const openCreate = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

  const openEdit = (item) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const handleSubmit = async (payload) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingItem) {
        await updateItem(config, editingItem, payload)
        setSuccess(`${config.singular} actualizado correctamente.`)
      } else {
        await createItem(config.endpoint, payload)
        setSuccess(`${config.singular} creado correctamente.`)
      }

      setFormOpen(false)
      setEditingItem(null)
      await loadRows()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await deleteItem(config, deleteTarget)
      setSuccess(`${config.singular} eliminado correctamente.`)
      setDeleteTarget(null)
      await loadRows()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (!canView) {
    return <Alert severity="warning">No tienes permisos para ver este módulo.</Alert>
  }

  return (
      <Box className="page-fade entity-page">
        <section className="section-header">
          <Box>
            <Typography variant="h4" component="h1">{config.title}</Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRows}>
              Actualizar
            </Button>

            {canCreate && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                  Nuevo
                </Button>
            )}
          </Stack>
        </section>

        {error && (
            <Alert severity="error" onClose={() => setError('')} className="pastel-alert error-alert" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800}>
                No pudimos completar la operación
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
        )}

        {success && (
            <Alert severity="success" onClose={() => setSuccess('')} className="pastel-alert success-alert" sx={{ mb: 2 }}>
              {success}
            </Alert>
        )}

        <Card className="filter-card">
          <CardContent>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{
                  alignItems: { xs: 'stretch', md: 'center' },
                  justifyContent: 'space-between'
                }}
            >
              <TextField
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar dentro de los registros..."
                  size="small"
                  sx={{ minWidth: { md: 360 } }}
                  slotProps={{
                    input: {
                      startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                      )
                    }
                  }}
              />

              <Typography variant="body2" color="text.secondary">
                {filteredRows.length} de {rows.length} registros
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {loading ? (
            <Box className="loading-box">
              <CircularProgress />
              <Typography>Cargando datos...</Typography>
            </Box>
        ) : (
            <section className="list entity-list">
              {filteredRows.length === 0 ? (
                  <Alert severity="info">No hay registros para mostrar.</Alert>
              ) : (
                  filteredRows.map((row) => (
                      <EntityRow
                          key={getRowKey(config, row)}
                          columns={config.columns}
                          row={row}
                          relationMaps={maps}
                          mainField={config.mainField}
                          onView={setJsonItem}
                          onEdit={openEdit}
                          onDelete={setDeleteTarget}
                          canEdit={canEdit}
                          canDelete={canDelete}
                      />
                  ))
              )}
            </section>
        )}

        <EntityFormDialog
            open={formOpen}
            title={editingItem ? `Editar ${config.singular}` : `Crear ${config.singular}`}
            fields={config.fields}
            item={editingItem}
            optionsByEndpoint={optionsByEndpoint}
            loading={saving}
            onClose={() => setFormOpen(false)}
            onSubmit={handleSubmit}
        />

        <ConfirmDialog
            open={Boolean(deleteTarget)}
            title={`Eliminar ${config.singular}`}
            message="Esta acción no se puede deshacer."
            loading={saving}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
        />

        <JsonDialog item={jsonItem} onClose={() => setJsonItem(null)} />
      </Box>
  )
}