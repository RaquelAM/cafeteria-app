import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  
  return context
}