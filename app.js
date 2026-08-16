import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

import { notFound, errorHandler } from './middlewares/errorMiddleware.js'

const app = express()

// ─── Core Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ─── Static Files (uploaded images) ────────────────────────────────
app.use('/uploads', express.static('uploads'))

// ─── Health Check ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🐾 Pet Shop API is running successfully!' })
})

// ─── API Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// ─── Error Handling Middleware ───────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
