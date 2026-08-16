import express from 'express'
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
} from '../controllers/authController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// ─── Public Routes ───────────────────────────────────────────────────
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// ─── Protected Routes ────────────────────────────────────────────────
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

// ─── Admin Routes ────────────────────────────────────────────────────
router.get('/users', protect, admin, getAllUsers)
router.delete('/users/:id', protect, admin, deleteUser)

export default router
