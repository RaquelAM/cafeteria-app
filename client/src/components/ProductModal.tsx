import { useState, useEffect } from 'react'
import api from '../services/api'

interface Product {
  id: string
  name: string
  price: number
  category: string
  available: boolean
}

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onSave: (product: Product) => void
}

const CATEGORIES = ['Café', 'Bebida', 'Comida', 'Postre', 'Pan', 'Otros']

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Café')
  const [available, setAvailable] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = product !== null

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price.toString())
      setCategory(product.category)
      setAvailable(product.available)
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        name,
        price: parseFloat(price),
        category,
        available
      }

      let response
      if (isEditing && product) {
        response = await api.put(`/products/${product.id}`, data)
      } else {
        response = await api.post('/products', data)
      }

      onSave(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="Ej: Cappuccino"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Disponible */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <label htmlFor="available" className="text-sm text-gray-700">
              Producto disponible para venta
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition disabled:opacity-50 shadow-md"
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}