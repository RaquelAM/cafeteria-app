import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import ProductModal from '../components/ProductModal'

interface Product {
  id: string
  name: string
  price: number
  category: string
  available: boolean
  createdAt: string
}

export default function Products() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [search, categoryFilter])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)

      const response = await api.get(`/products?${params.toString()}`)
      setProducts(response.data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
      setDeleteConfirm(null)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al eliminar producto')
    }
  }

  const handleToggleAvailability = async (id: string) => {
    try {
      const response = await api.patch(`/products/${id}/toggle`)
      setProducts(products.map(p => p.id === id ? response.data : p))
    } catch (error) {
      console.error('Error al toggle:', error)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleModalSave = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p))
    } else {
      setProducts([product, ...products])
    }
    handleModalClose()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Categorías únicas de los productos
  const categories = ['all', ...new Set(products.map(p => p.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-xl">☕</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Cafetería App</h1>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-2">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  Dashboard
                </button>
                <button className="px-3 py-2 text-sm text-primary-600 bg-primary-50 rounded-lg font-medium">
                  Productos
                </button>
              </nav>
              
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition shadow-sm text-sm"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Productos del menú</h2>
            <p className="text-gray-600 text-sm mt-1">
              {products.length} {products.length === 1 ? 'producto' : 'productos'} en total
            </p>
          </div>
          
          {user?.role === 'ADMIN' && (
            <button
              onClick={handleCreate}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Nuevo producto</span>
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="md:w-64">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow-sm border border-primary-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-600">No hay productos</p>
              <p className="text-sm text-gray-500 mt-1">
                {search || categoryFilter !== 'all' 
                  ? 'Intenta con otros filtros' 
                  : 'Crea tu primer producto para empezar'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    {user?.role === 'ADMIN' && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.role === 'ADMIN' ? (
                          <button
                            onClick={() => handleToggleAvailability(product.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                              product.available
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {product.available ? '✓ Disponible' : '✗ No disponible'}
                          </button>
                        ) : (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            product.available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.available ? '✓ Disponible' : '✗ No disponible'}
                          </span>
                        )}
                      </td>
                      {user?.role === 'ADMIN' && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-primary-600 hover:text-primary-800 transition"
                            >
                              Editar
                            </button>
                            {deleteConfirm === product.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                                >
                                  Sí
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-gray-600 hover:text-gray-800 text-xs"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(product.id)}
                                className="text-red-600 hover:text-red-800 transition"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal para crear/editar */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  )
}