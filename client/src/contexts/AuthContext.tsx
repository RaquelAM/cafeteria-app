import { createContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'

// Definimos los tipos de TypeScript
interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MESERO'
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Creamos el contexto (inicialmente vacío)
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider: envuelve la app y provee el contexto a todos los componentes
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Al cargar la app, verificar si hay un token guardado
  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          // Verificar que el token siga siendo válido
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
          
          setToken(storedToken)
          setUser(response.data)
        } catch (error) {
          // Si el token es inválido, limpiar todo
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    loadStoredAuth()
  }, [])

  // Función de login
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    
    const { token: newToken, user: newUser } = response.data
    
    // Guardar en el estado
    setToken(newToken)
    setUser(newUser)
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  // Función de logout
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Valor que vamos a proveer al contexto
  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}