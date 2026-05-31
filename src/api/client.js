import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/iaslab/compu2/911-api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

function readSession() {
  const raw = localStorage.getItem('fitcampus_session') || localStorage.getItem('user')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem('fitcampus_session')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return null
  }
}

api.interceptors.request.use((config) => {
  const session = readSession()
  const token = session?.accessToken || session?.token || localStorage.getItem('token')
  const isLoginRequest = config.url?.includes('/api/public/auth/login') || config.url?.includes('/api/auth/login')

  if (token && !isLoginRequest) {
    config.headers.Authorization = `${session?.tokenType || 'Bearer'} ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/api/public/auth/login') || error.config?.url?.includes('/api/auth/login')

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('fitcampus_session')
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('fitcampus:logout'))
    }

    return Promise.reject(error)
  }
)

export default api
