import express from 'express'
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  cancelOrder,
} from '../controllers/orderController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// ─── Protected Routes (logged-in users) ─────────────────────────────
// POST /api/orders              → place a new order
// GET  /api/orders/my-orders    → get current user's orders
// GET  /api/orders/:id          → get a specific order
// PUT  /api/orders/:id/pay      → mark order as paid
// PUT  /api/orders/:id/cancel   → cancel an order
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/pay', protect, updateOrderToPaid)
router.put('/:id/cancel', protect, cancelOrder)

// ─── Admin Routes ────────────────────────────────────────────────────
// GET /api/orders              → get all orders
// PUT /api/orders/:id/deliver  → mark order as delivered
router.get('/', protect, admin, getAllOrders)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered)

export default router
