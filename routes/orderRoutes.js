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

router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/pay', protect, updateOrderToPaid)
router.put('/:id/cancel', protect, cancelOrder)

router.get('/', protect, admin, getAllOrders)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered)

export default router
