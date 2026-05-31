import api from '../api/client.js'

export async function loginService(email, password) {
  const response = await api.post('/api/public/auth/login', { email, password })
  return response.data
}

export function logoutService() {
  localStorage.removeItem('fitcampus_session')
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  return true
}
