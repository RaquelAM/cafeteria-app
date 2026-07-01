import { PrismaClient } from '@prisma/client'

// Evitamos crear múltiples instancias de PrismaClient en desarrollo
// (por el hot-reload de tsx)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}