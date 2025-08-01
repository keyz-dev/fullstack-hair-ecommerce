const Order = require('../models/order');
const Product = require('../models/product');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../utils/errors');


// Place a new order
const newOrder = async (req, res, next) => {
  const {
    shippingAddress,
    cartItems,
    paymentMethod,
    subtotal,
    shipping,
    tax,
    processingFee,
    total,
    notes,
    customerInfo // For guest users
  } = req.body;

  // For authenticated users, get customer info from user object
  // For guest users, use provided customerInfo
  const finalCustomerInfo = req.rootUser ? {
    firstName: req.rootUser.firstName,
    lastName: req.rootUser.lastName,
    email: req.rootUser.email,
    phone: req.rootUser.phone
  } : customerInfo;

  if (!finalCustomerInfo || !finalCustomerInfo.firstName || !finalCustomerInfo.email) {
    return next(new BadRequestError('Customer information is required'));
  }

  // Validate products and stock
  const orderItems = [];
  for (let i = 0; i < cartItems.length; i++) {
    const product = await Product.findById(cartItems[i].product);
    if (!product) return next(new NotFoundError('Product not found'));
    if (product.stock < cartItems[i].quantity) {
      return next(new BadRequestError(`Product ${product.name} is out of stock. Only ${product.stock} left`));
    }

    orderItems.push({
      product: cartItems[i].product,
      quantity: cartItems[i].quantity,
      unitPrice: cartItems[i].price,
      variant: cartItems[i].variant
    });
  }
  // Generate order number
  const orderCount = await Order.countDocuments();
  const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

  const orderData = {
    orderNumber,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount: total,
    subtotal,
    shipping,
    tax,
    processingFee,
    notes
  };

  // Add user info (authenticated user or guest)
  if (req.rootUser) {
    orderData.user = req.rootUser._id;
  } else {
    orderData.guestInfo = customerInfo;
  }

  const order = new Order(orderData);
  await order.save();
  // Reduce stock
  for (let i = 0; i < cartItems.length; i++) {
    const product = await Product.findById(cartItems[i].product);
    product.stock -= cartItems[i].quantity;
    await product.save();
  }
  res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
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