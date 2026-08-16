import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// ─── Public Routes ───────────────────────────────────────────────────
// GET /api/products         → list all (with ?category, ?sale, ?search, ?sort, ?page, ?limit)
// GET /api/products/:id     → get single product
router.get('/', getProducts)
router.get('/:id', getProductById)

// ─── Protected Routes ────────────────────────────────────────────────
// POST /api/products/:id/reviews → add review (logged-in users)
router.post('/:id/reviews', protect, createProductReview)

// ─── Admin Routes ────────────────────────────────────────────────────
// POST   /api/products       → create product
// PUT    /api/products/:id   → update product
// DELETE /api/products/:id   → delete product
router.post('/', protect, admin, createProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

export default router
