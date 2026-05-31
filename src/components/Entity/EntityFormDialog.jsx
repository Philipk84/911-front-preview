import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField
} from '@mui/material'
import { buildEmptyPayload, normalizePayload, optionText } from '../../utils/formatters.js'

function initialValues(fields, item) {
  if (!item) return buildEmptyPayload(fields)

  return fields.reduce((values, field) => {
    if (field.readOnly) return values
    if (field.type === 'multiNumber') {
      values[field.name] = Array.isArray(item[field.name]) ? item[field.name].join(', ') : item[field.name] || ''
    } else {
      values[field.name] = item[field.name] ?? buildEmptyPayload([field])[field.name]
    }
    return values
  }, {})
}

export default function EntityFormDialog({ open, title, fields, item, optionsByEndpoint, onClose, onSubmit, loading }) {
  const init = useMemo(() => initialValues(fields, item), [fields, item])
  const [values, setValues] = useState(init)

  useEffect(() => {
    if (open) setValues(init)
  }, [open, init])

  const handleChange = (field, value) => {
    setValues((current) => ({ ...current, [field.name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSubmit(normalizePayload(values, fields))
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md">
      <Box component="form" onSubmit={submit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.2} sx={{ mt: 1 }}>
            {fields.filter((field) => !field.readOnly).map((field) => {
              const value = values[field.name]

              if (field.type === 'boolean') {
                return (
                  <FormControlLabel
                    key={field.name}
                    control={<Checkbox checked={Boolean(value)} onChange={(event) => handleChange(field, event.target.checked)} />}
                    label={field.label}
                  />
                )
              }

              if (field.type === 'select') {
                const options = optionsByEndpoint[field.optionsEndpoint] || []
                return (
                  <FormControl key={field.name} fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      label={field.label}
                      value={value ?? ''}
                      onChange={(event) => handleChange(field, event.target.value)}
                    >
                      <MenuItem value=""><em>Seleccionar</em></MenuItem>
                      {options.map((option) => (
                        <MenuItem key={option[field.optionValue || 'id']} value={option[field.optionValue || 'id']}>
                          {optionText(option, field.optionLabel)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              }

              if (field.type === 'multiSelect') {
                const options = optionsByEndpoint[field.optionsEndpoint] || []
                const selected = Array.isArray(value) ? value : []
                return (
                  <FormControl key={field.name} fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      multiple
                      label={field.label}
                      value={selected}
                      input={<OutlinedInput label={field.label} />}
                      onChange={(event) => handleChange(field, event.target.value)}
                      renderValue={(selectedValues) => selectedValues
                        .map((id) => optionText(options.find((option) => option[field.optionValue || 'id'] === id), field.optionLabel) || id)
                        .join(', ')}
                    >
                      {options.map((option) => {
                        const optionValue = option[field.optionValue || 'id']
                        return (
                          <MenuItem key={optionValue} value={optionValue}>
                            <Checkbox checked={selected.indexOf(optionValue) > -1} />
                            <ListItemText primary={optionText(option, field.optionLabel)} />
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                )
              }

              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type === 'textarea' || field.type === 'multiNumber' ? 'text' : field.type || 'text'}
                  value={value ?? ''}
                  required={field.required}
                  multiline={field.type === 'textarea'}
                  rows={field.type === 'textarea' ? 3 : undefined}
                  helperText={field.type === 'multiNumber' ? 'Escribe los IDs separados por coma.' : field.helperText}
                  onChange={(event) => handleChange(field, event.target.value)}
                  fullWidth
                />
              )
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
