export default function Dashboard() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Aquí irá el dashboard con ventas del día, órdenes pendientes, etc.
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
  
          {/* Sección de órdenes recientes */}
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