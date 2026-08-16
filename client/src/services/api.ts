import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// INTERCEPTOR DE PETICIONES
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// INTERCEPTOR DE RESPUESTAS
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo hacer redirect si:
    // 1. El error es 401 (no autorizado)
    // 2. NO es una petición de login o register
    // 3. HAY un token guardado (significa que estaba logueado y expiró)
    const isAuthRequest = 
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register')
    
    const hasToken = localStorage.getItem('token')

    if (error.response?.status === 401 && !isAuthRequest && hasToken) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api