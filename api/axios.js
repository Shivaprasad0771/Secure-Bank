import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const getErrorMessage = (error) => {
  const data = error.response?.data
  if (!data) return 'Network error. Please try again.'
  if (data.message) return data.message
  if (typeof data === 'object') {
    const values = Object.values(data)
    if (values.length) return values[0]
  }
  return 'Something went wrong. Please try again.'
}
