import api from '../api/client.js'

export async function listItems(endpoint) {
  const response = await api.get(endpoint)
  return Array.isArray(response.data) ? response.data : []
}

export async function createItem(endpoint, payload) {
  const response = await api.post(endpoint, payload)
  return response.data
}

export async function updateItem(config, item, payload) {
  const response = await api.put(buildItemPath(config, item), payload)
  return response.data
}

export async function deleteItem(config, item) {
  await api.delete(buildItemPath(config, item))
}

export function buildItemPath(config, item) {
  if (config.idFields?.length) {
    const suffix = config.idFields.map((field) => item?.[field]).join('/')
    return `${config.endpoint}/${suffix}`
  }

  return `${config.endpoint}/${item?.id}`
}
