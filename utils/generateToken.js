import jwt from 'jsonwebtoken'

/**
 * Generates a signed JWT token and attaches it as an HTTP-only cookie.
 * @param {object} res - Express response object
 * @param {string} userId - The user's MongoDB ObjectId
 * @returns {string} The generated JWT token string
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  })

  // Set HTTP-only cookie so it cannot be accessed by JavaScript
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  })

  return token
}

export default generateToken
