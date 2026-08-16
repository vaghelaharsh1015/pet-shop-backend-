import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Validate fields
    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Please provide name, email, and password')
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(409)
      throw new Error('A user with this email already exists')
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({ name, email, password })

    // Generate JWT and set cookie
    generateToken(res, user._id)

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400)
      throw new Error('Please provide email and password')
    }

    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    // Generate JWT and set cookie
    generateToken(res, user._id)

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone
    user.avatar = req.body.avatar || user.avatar
    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address }
    }
    // Update password only if provided
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: users.length, data: users })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }
    if (user.role === 'admin') {
      res.status(400)
      throw new Error('Cannot delete an admin account')
    }
    await user.deleteOne()
    res.status(200).json({ success: true, message: 'User removed successfully' })
  } catch (error) {
    next(error)
  }
}
