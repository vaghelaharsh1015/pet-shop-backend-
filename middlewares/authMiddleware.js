import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// ─── protect: Verify JWT and attach user to request ─────────────────
export const protect = async (req, res, next) => {
  let token

  // Check for token in Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) {
    res.status(401)
    return next(new Error('Not authorized, no token provided'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      res.status(401)
      return next(new Error('Not authorized, user not found'))
    }

    next()
  } catch (error) {
    res.status(401)
    next(new Error('Not authorized, token failed or expired'))
  }
}

// ─── admin: Allow access only to admin users ─────────────────────────
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403)
    next(new Error('Access denied: Admins only'))
  }
}
