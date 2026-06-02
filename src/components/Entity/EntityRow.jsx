import DeleteOutlineIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { formatValue } from '../../utils/formatters.js'

function safeText(value) {
    if (value === null || value === undefined || value === '') return '—'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
}

function displayValue(column, row, relationMaps) {
    const raw = row[column.name]
    const relationMap = relationMaps[column.name]

    if (Array.isArray(raw)) {
        const cleanValues = raw.filter((item) => item !== null && item !== undefined && item !== '')

        if (!cleanValues.length) return []

        return cleanValues.map((id) => safeText(relationMap?.get(id) || id))
    }

    if (relationMap?.has(raw)) {
        return safeText(relationMap.get(raw))
    }

    return formatValue(raw)
}

function compactValue(value) {
    if (!Array.isArray(value)) return safeText(value)

    if (!value.length) return '—'

    const visible = value.slice(0, 4).map(safeText).join(', ')
    const extra = value.length > 4 ? ` y ${value.length - 4} más` : ''

    return `${visible}${extra}`
}

function arrayEntries(column, row, relationMaps) {
    const raw = row[column.name]
    const relationMap = relationMaps[column.name]

    if (!Array.isArray(raw)) return []

    return raw
        .filter((id) => id !== null && id !== undefined && id !== '')
        .map((id) => ({
            id,
            label: safeText(relationMap?.get(id) || id)
        }))
}

export default function EntityRow({
                                      columns,
                                      row,
                                      relationMaps,
                                      mainField,
                                      onView,
                                      onEdit,
                                      onDelete,
                                      canEdit,
                                      canDelete
                                  }) {
    const titleColumn = columns.find((column) => column.name === mainField) || columns[1] || columns[0]
    const title = safeText(displayValue(titleColumn, row, relationMaps))

    const subtitle = columns
        .filter((column) => column.name !== titleColumn.name)
        .filter((column) => !Array.isArray(row[column.name]))
        .slice(0, 4)
        .map((column) => `${column.label}: ${compactValue(displayValue(column, row, relationMaps))}`)
        .join(' · ')

    const chipColumns = columns.filter((column) => Array.isArray(row[column.name])).slice(0, 2)

    return (
        <Box className="row entity-row">
            <Box className="info">
                <Typography component="strong" className="entity-title">
                    {title}
                </Typography>

                {subtitle && (
                    <Typography variant="body2" color="text.secondary" className="entity-subtitle">
                        {subtitle}
                    </Typography>
                )}

                <Stack direction="row" spacing={0.7} useFlexGap className="chip-line">
                    {chipColumns.flatMap((column) => {
                        const entries = arrayEntries(column, row, relationMaps)

                        return entries.map((entry) => (
                            <Chip
                                key={`${column.name}-${entry.id}`}
                                label={entry.label}
                                className="pastel-chip relation-chip"
                                size="small"
                            />
                        ))
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