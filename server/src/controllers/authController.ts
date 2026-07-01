import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'

// ============================================
// REGISTRO
// ============================================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body

    // 1. Validar que vengan todos los campos
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Nombre, email y contraseña son requeridos' 
      })
    }

    // 2. Verificar que el email no esté registrado
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Este email ya está registrado' 
      })
    }

    // 3. Hashear la contraseña (NUNCA guardar contraseñas en texto plano)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'MESERO' // Por defecto es MESERO
      }
    })

    // 5. Generar el token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // 6. Responder (sin mandar la contraseña)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============================================
// LOGIN
// ============================================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // 1. Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      })
    }

    // 2. Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      })
    }

    // 3. Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      })
    }

    // 4. Generar token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // 5. Responder
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============================================
// OBTENER USUARIO ACTUAL (para verificar el token)
// ============================================
export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user viene del middleware de autenticación
    const userId = (req as any).user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error en getMe:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}