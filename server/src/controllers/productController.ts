import { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

// ============================================
// OBTENER TODOS LOS PRODUCTOS
// ============================================
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, available } = req.query

    // Construir filtros dinámicamente
    const where: any = {}

    if (search) {
      where.name = { contains: String(search), mode: 'insensitive' }
    }

    if (category && category !== 'all') {
      where.category = String(category)
    }

    if (available !== undefined) {
      where.available = available === 'true'
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    res.json(products)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============================================
// OBTENER UN PRODUCTO POR ID
// ============================================
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(product)
  } catch (error) {
    console.error('Error al obtener producto:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============================================
// CREAR PRODUCTO
// ============================================
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, category, available } = req.body

    // Validaciones
    if (!name || price === undefined || !category) {
      return res.status(400).json({ 
        error: 'Nombre, precio y categoría son requeridos' 
      })
    }

    if (price < 0) {
      return res.status(400).json({ error: 'El precio no puede ser negativo' })
    }

    // Verificar que no exista un producto con el mismo nombre
    const existingProduct = await prisma.product.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    })

    if (existingProduct) {
      return res.status(400).json({ 
        error: 'Ya existe un producto con ese nombre' 
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        available: available !== undefined ? available : true
      }
    })

    res.status(201).json(product)
  } catch (error) {
    console.error('Error al crear producto:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============================================
// ACTUALIZAR PRODUCTO
// ============================================
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, price, category, available } = req.body

    // Verificar que el producto exista
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    // Si cambia el nombre, verificar que no exista otro con ese nombre
    if (name && name !== existingProduct.name) {
      const productWithSameName = await prisma.product.findFirst({
        where: { 
          name: { equals: name, mode: 'insensitive' },
          id: { not: id }
        }
      })

      if (productWithSameName) {
        return res.status(400).json({ 
          error: 'Ya existe otro producto con ese nombre' 
        })
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(available !== undefined && { available })
      }
    })

    res.json(product)
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============================================
// ELIMINAR PRODUCTO
// ============================================
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Verificar que el producto exista
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { orderItems: true }
    })

    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    // No permitir borrar si tiene órdenes asociadas
    if (existingProduct.orderItems.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar un producto que ha sido vendido. Considera desactivarlo en su lugar.' 
      })
    }

    await prisma.product.delete({
      where: { id }
    })

    res.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============================================
// TOGGLE DISPONIBILIDAD (activar/desactivar)
// ============================================
export const toggleProductAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { available: !product.available }
    })

    res.json(updated)
  } catch (error) {
    console.error('Error al toggle disponibilidad:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}