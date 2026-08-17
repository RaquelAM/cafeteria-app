import { Router } from 'express'
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  toggleProductAvailability
} from '../controllers/productController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = Router()

// Todas las rutas de productos requieren autenticación
router.use(authenticate)

router.get('/', getProducts)
router.get('/:id', getProductById)

// Solo ADMIN puede crear, actualizar y eliminar
router.post('/', requireRole('ADMIN'), createProduct)
router.put('/:id', requireRole('ADMIN'), updateProduct)
router.delete('/:id', requireRole('ADMIN'), deleteProduct)
router.patch('/:id/toggle', requireRole('ADMIN'), toggleProductAvailability)

export default router