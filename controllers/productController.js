import Product from '../models/Product.js'

export const getProducts = async (req, res, next) => {
  try {
    const { category, sale, featured, search, sort, page = 1, limit = 12 } = req.query

    // Build query filter
    const filter = {}
    if (category && category !== 'All') filter.category = category
    if (sale === 'true') filter.sale = true
    if (featured === 'true') filter.isFeatured = true
    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    // Sorting
    let sortOption = { createdAt: -1 } // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 }
    if (sort === 'price_desc') sortOption = { price: -1 }
    if (sort === 'rating') sortOption = { rating: -1 }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(filter)

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products,
    })
  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }
    await product.deleteOne()
    res.status(200).json({ success: true, message: 'Product removed successfully' })
  } catch (error) {
    next(error)
  }
}

export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )
    if (alreadyReviewed) {
      res.status(400)
      throw new Error('You have already reviewed this product')
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    }
    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length

    await product.save()

    res.status(201).json({ success: true, message: 'Review added successfully' })
  } catch (error) {
    next(error)
  }
}
