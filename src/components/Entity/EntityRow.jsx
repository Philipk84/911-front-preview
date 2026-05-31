import DeleteOutlineIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { formatValue } from '../../utils/formatters.js'

function displayValue(column, row, relationMaps) {
  const raw = row[column.name]
  const relationMap = relationMaps[column.name]

  if (Array.isArray(raw)) {
    return raw.length ? raw.map((id) => relationMap?.get(id) || id) : []
  }

  if (relationMap?.has(raw)) return relationMap.get(raw)

  return formatValue(raw)
}

export default function EntityRow({ columns, row, relationMaps, mainField, onView, onEdit, onDelete, canEdit, canDelete }) {
  const titleColumn = columns.find((column) => column.name === mainField) || columns[1] || columns[0]
  const title = displayValue(titleColumn, row, relationMaps)
  const subtitle = columns
    .filter((column) => column.name !== titleColumn.name)
    .slice(0, 3)
    .map((column) => `${column.label}: ${formatValue(displayValue(column, row, relationMaps))}`)
    .join(' · ')

  const chipColumns = columns.filter((column) => Array.isArray(row[column.name])).slice(0, 2)

  return (
    <Box className="row entity-row">
      <Box className="info">
        <Typography component="strong">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        <Stack direction="row" spacing={0.7} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
          {chipColumns.flatMap((column) => {
            const values = displayValue(column, row, relationMaps)
            return values.map((value) => <Chip key={`${column.name}-${value}`} label={value} className="pastel-chip" size="small" />)
          })}
        </Stack>
      </Box>

      <Stack className="actions" direction="row" spacing={0.8}>
        <Tooltip title="Ver JSON">
          <IconButton className="btn-small icon-action" onClick={() => onView(row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {canEdit && (
          <Button className="btn-small" startIcon={<EditIcon />} onClick={() => onEdit(row)}>
            Editar
          </Button>
        )}
        {canDelete && (
          <Button className="danger" startIcon={<DeleteOutlineIcon />} onClick={() => onDelete(row)}>
            Eliminar
          </Button>
        )}
      </Stack>
    </Box>
  )
}
