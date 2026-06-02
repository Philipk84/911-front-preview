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
import { buildEmptyPayload, expandOptions, normalizePayload } from '../../utils/formatters.js'

const selectMenuProps = {
  slotProps: {
    paper: {
      sx: {
        maxHeight: 360,
        mt: 0.8,
        borderRadius: 3,
        boxShadow: '0 18px 45px rgba(0,0,0,0.16)'
      }
    }
  }
}

function initialValues(fields, item) {
  if (!item) return buildEmptyPayload(fields)

  return fields.reduce((values, field) => {
    if (field.readOnly) return values

    if (field.type === 'multiNumber') {
      values[field.name] = Array.isArray(item[field.name])
          ? item[field.name].join(', ')
          : item[field.name] || ''
    } else {
      values[field.name] = item[field.name] ?? buildEmptyPayload([field])[field.name]
    }

    return values
  }, {})
}

function cleanValue(value) {
  if (value === null || value === undefined) return ''
  return value
}

function createFallbackOption(field, value) {
  if (value === '' || value === null || value === undefined) return null

  return {
    value,
    label: `Actual #${value}`
  }
}

function getOptionsWithFallback(options, field, value) {
  const expanded = expandOptions(options || [], field)
  const clean = cleanValue(value)

  if (clean === '') return expanded

  const exists = expanded.some((option) => String(option.value) === String(clean))

  if (exists) return expanded

  const fallback = createFallbackOption(field, clean)

  return fallback ? [fallback, ...expanded] : expanded
}

function getMultiOptionsWithFallback(options, field, values) {
  const expanded = expandOptions(options || [], field)
  const selected = Array.isArray(values) ? values : []

  const missingOptions = selected
      .filter((value) => value !== null && value !== undefined && value !== '')
      .filter((value) => !expanded.some((option) => String(option.value) === String(value)))
      .map((value) => ({
        value,
        label: `${field.label} actual #${value}`
      }))

  return [...missingOptions, ...expanded]
}

export default function EntityFormDialog({
                                           open,
                                           title,
                                           fields,
                                           item,
                                           optionsByEndpoint,
                                           onClose,
                                           onSubmit,
                                           loading
                                         }) {
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
                          control={
                            <Checkbox
                                checked={Boolean(value)}
                                onChange={(event) => handleChange(field, event.target.checked)}
                            />
                          }
                          label={field.label}
                      />
                  )
                }

                if (field.type === 'select') {
                  const rawOptions = optionsByEndpoint[field.optionsEndpoint] || []
                  const options = getOptionsWithFallback(rawOptions, field, value)
                  const selectValue = cleanValue(value)

                  return (
                      <FormControl key={field.name} fullWidth>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            label={field.label}
                            value={selectValue}
                            onChange={(event) => handleChange(field, event.target.value)}
                            MenuProps={selectMenuProps}
                        >
                          <MenuItem value="">
                            <em>Seleccionar</em>
                          </MenuItem>

                          {options.map((option) => (
                              <MenuItem key={`${field.name}-${option.value}`} value={option.value}>
                                {option.label}
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                  )
                }

                if (field.type === 'multiSelect') {
                  const rawOptions = optionsByEndpoint[field.optionsEndpoint] || []
                  const selected = Array.isArray(value) ? value : []
                  const options = getMultiOptionsWithFallback(rawOptions, field, selected)

                  return (
                      <FormControl key={field.name} fullWidth>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            multiple
                            label={field.label}
                            value={selected}
                            input={<OutlinedInput label={field.label} />}
                            onChange={(event) => handleChange(field, event.target.value)}
                            MenuProps={selectMenuProps}
                            renderValue={(selectedValues) =>
                                selectedValues
                                    .map((id) => options.find((option) => String(option.value) === String(id))?.label || `#${id}`)
                                    .join(', ')
                            }
                        >
                          {options.map((option) => (
                              <MenuItem key={`${field.name}-${option.value}`} value={option.value}>
                                <Checkbox checked={selected.some((id) => String(id) === String(option.value))} />
                                <ListItemText primary={option.label} />
                              </MenuItem>
                          ))}
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
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
  )
}