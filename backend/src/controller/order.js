const Order = require('../models/order');
const Product = require('../models/product');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../utils/errors');
const { orderCreateSchema } = require('../schema/orderSchema');

// Place a new order
const newOrder = async (req, res, next) => {
  const { error } = orderCreateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  let total = 0;
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(orderItems[i].product);
    if (!product) return next(new NotFoundError('Product not found'));
    if (product.stock < orderItems[i].quantity) {
      return next(new BadRequestError(`Product ${product.name} is out of stock. Only ${product.stock} left`));
    }
    orderItems[i].unitPrice = product.price;
    total += product.price * orderItems[i].quantity;
  }
  const order = new Order({
    user: req.rootUser._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount: total,
  });
  await order.save();
  // Reduce stock
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(orderItems[i].product);
    product.stock -= orderItems[i].quantity;
    await product.save();
  }
  res.status(201).json({ success: true, message: 'Order placed successfully', order });
};

// Get all orders (admin)
const getAdminOrders = async (req, res, next) => {
  const orders = await Order.find({}).populate('user');
  res.status(200).json({ success: true, orders });
};

// Get my orders
const getMyOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.rootUser._id });
  res.status(200).json({ success: true, orders });
};

// Get single order
const getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user').populate('orderItems.product');
  if (!order) return next(new NotFoundError('Order not found'));
  if (order.user.toString() !== req.rootUser._id.toString()) {
    return next(new UnauthorizedError('You are not authorized to view this order'));
  }
  res.status(200).json({ success: true, order });
};

module.exports = {
  newOrder,
  getAdminOrders,
  getMyOrders,
  getSingleOrder,
};
