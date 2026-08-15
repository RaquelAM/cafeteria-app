import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con info del usuario */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Bienvenido, <span className="font-semibold text-primary-600">{user?.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition shadow-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-100 hover:shadow-lg transition">
            <h3 className="text-sm font-medium text-gray-500">Ventas de hoy</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">$0.00</p>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>↑ 0%</span>
              <span className="ml-2 text-gray-500">vs ayer</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-100 hover:shadow-lg transition">
            <h3 className="text-sm font-medium text-gray-500">Órdenes</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>↑ 0%</span>
              <span className="ml-2 text-gray-500">vs ayer</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-100 hover:shadow-lg transition">
            <h3 className="text-sm font-medium text-gray-500">Productos vendidos</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>↑ 0%</span>
              <span className="ml-2 text-gray-500">vs ayer</span>
            </div>
          </div>
        </div>

        {/* Órdenes recientes */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-primary-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Órdenes recientes</h2>
          <p className="text-gray-500 text-center py-8">
            No hay órdenes recientes
          </p>
        </div>
      </div>
    </div>
  )
}