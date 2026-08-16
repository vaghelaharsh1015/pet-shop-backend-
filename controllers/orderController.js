import Order from '../models/Order.js'

export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body

    if (!orderItems || orderItems.length === 0) {
      res.status(400)
      throw new Error('No order items provided')
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })

    res.status(201).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403)
      throw new Error('Not authorized to view this order')
    }

    res.status(200).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: orders.length, data: orders })
  } catch (error) {
    next(error)
  }
}


export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    order.isPaid = true
    order.paidAt = Date.now()
    order.status = 'Processing'
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      emailAddress: req.body.payer?.email_address,
    }

    const updatedOrder = await order.save()
    res.status(200).json({ success: true, data: updatedOrder })
  } catch (error) {
    next(error)
  }
}

export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    order.isDelivered = true
    order.deliveredAt = Date.now()
    order.status = 'Delivered'

    const updatedOrder = await order.save()
    res.status(200).json({ success: true, data: updatedOrder })
  } catch (error) {
    next(error)
  }
}

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, count: orders.length, data: orders })
  } catch (error) {
    next(error)
  }
}

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    if (order.status === 'Delivered' || order.status === 'Shipped') {
      res.status(400)
      throw new Error('Cannot cancel a shipped or delivered order')
    }

    order.status = 'Cancelled'
    await order.save()

    res.status(200).json({ success: true, message: 'Order cancelled successfully' })
  } catch (error) {
    next(error)
  }
}
