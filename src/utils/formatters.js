export function getErrorMessage(error, context = '') {
  const status = error?.response?.status
  const backendMessage = error?.response?.data?.message || error?.response?.data?.error

  if (context === 'login') {
    if (status === 400) return 'El login REST recibe correo y contraseña. Revisa que estés usando un correo válido.'
    if (status === 401) return backendMessage || 'Correo o contraseña incorrectos.'
    if (status === 403) return 'El servidor bloqueó el login. Revisa CORS, CSRF o la ruta pública del API.'
  }

  if (status === 400) return backendMessage || 'Los datos enviados no son válidos. Revisa los campos obligatorios.'
  if (status === 401) return backendMessage || 'Tu sesión expiró o el token no es válido. Inicia sesión nuevamente.'
  if (status === 403) return backendMessage || 'No tienes permisos para realizar esta acción.'
  if (status === 404) return backendMessage || 'El recurso solicitado no existe o fue eliminado.'
  if (status === 409) return backendMessage || 'Ya existe un registro con esos datos.'
  if (status >= 500) return backendMessage || 'El servidor respondió con un error interno.'

  return error?.message || 'Ocurrió un error inesperado.'
}

export function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'

  if (Array.isArray(value)) {
    const cleanValues = value
        .filter((item) => item !== null && item !== undefined && item !== '')
        .map((item) => String(item))

    return cleanValues.length ? cleanValues.join(', ') : '—'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

export function optionText(option, labelKey, currentValue = null) {
  if (!option) return ''

  if (typeof labelKey === 'function') {
    const result = labelKey(option, currentValue)
    return result === null || result === undefined ? '' : String(result)
  }

  if (Array.isArray(labelKey)) {
    return labelKey
        .map((key) => option?.[key])
        .filter((value) => value !== null && value !== undefined && value !== '')
        .join(' ')
  }

  const result = option?.[labelKey] ?? option?.name ?? option?.id ?? ''
  return result === null || result === undefined ? '' : String(result)
}

export function getOptionValues(option, field) {
  if (!option) return []

  let value

  if (typeof field.optionValue === 'function') {
    value = field.optionValue(option)
  } else {
    const key = field.optionValue || 'id'
    value = option?.[key]
  }

  const values = Array.isArray(value) ? value : [value]

  return values.filter((item) => item !== null && item !== undefined && item !== '')
}

export function expandOptions(options, field) {
  return (options || []).flatMap((option) => {
    const values = getOptionValues(option, field)

    return values.map((value) => ({
      value,
      label: optionText(option, field.optionLabel, value)
    }))
  })
}

export function buildEmptyPayload(fields) {
  return fields.reduce((payload, field) => {
    if (field.readOnly) return payload

    if (field.type === 'number' || field.type === 'select') payload[field.name] = ''
    else if (field.type === 'boolean') payload[field.name] = false
    else if (field.type === 'multiSelect') payload[field.name] = []
    else if (field.type === 'multiNumber') payload[field.name] = ''
    else payload[field.name] = ''

    return payload
  }, {})
}

export function normalizePayload(values, fields) {
  return fields.reduce((payload, field) => {
    if (field.readOnly) return payload

    const value = values[field.name]

    if (field.type === 'number' || field.type === 'select') {
      payload[field.name] = value === '' || value === null || value === undefined ? null : Number(value)
      return payload
    }

    if (field.type === 'boolean') {
      payload[field.name] = Boolean(value)
      return payload
    }

    if (field.type === 'time') {
      payload[field.name] = typeof value === 'string' && value.length === 5 ? `${value}:00` : value
      return payload
    }

    if (field.type === 'multiSelect') {
      payload[field.name] = Array.isArray(value)
          ? value.filter((item) => item !== null && item !== undefined && item !== '').map(Number)
          : []

      return payload
    }

    if (field.type === 'multiNumber') {
      payload[field.name] = String(value || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map(Number)

      return payload
    }

    payload[field.name] = value
    return payload
  }, {})
}

export function getRowKey(config, row) {
  if (config.idFields?.length) {
    return config.idFields.map((field) => row?.[field]).join('-')
  }

  return row?.id
}