const Order = require('../models/order');
const Product = require('../models/product');
const PaymentMethod = require('../models/paymentMethod');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../utils/errors');
const { normalizePhoneNumber } = require('../utils/phoneValidation');
const { formatOrderData } = require('../utils/returnFormats/orderData');

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
  let finalCustomerInfo;
  
  // Allow both authenticated and guest users to provide/override customerInfo
  if (customerInfo) {
    finalCustomerInfo = {
      ...customerInfo,
      phone: normalizePhoneNumber(customerInfo.phone)
    };
  } else if (req.authUser) {
    finalCustomerInfo = {
      firstName: req.authUser.name?.split(' ')[0] || '',
      lastName: req.authUser.name?.split(' ')[1] || '',
      email: req.authUser.email,
      phone: req.authUser.phone
    };
  } else {
    return next(new BadRequestError('Customer information is required for guest users'));
  }

  // Validate payment method
  const paymentMethodDoc = await PaymentMethod.findById(paymentMethod);
  if (!paymentMethodDoc) {
    return next(new NotFoundError('Payment method not found'));
  }
  if (!paymentMethodDoc.isActive) {
    return next(new BadRequestError('Selected payment method is not active'));
  }
  
  // Validate currency if payment method has currency restrictions
  if (paymentMethodDoc.supportedCurrencies && paymentMethodDoc.supportedCurrencies.length > 0) {
    // You might want to get the currency from the request or user preferences
    // For now, we'll assume XAF is the default currency
    const orderCurrency = req.body.currency || 'XAF';
    if (!paymentMethodDoc.supportedCurrencies.includes(orderCurrency)) {
      return next(new BadRequestError(`Payment method does not support ${orderCurrency} currency`));
    }
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
    notes,
    guestInfo: finalCustomerInfo
  };

  // Add user info (authenticated user or guest)
  if (req.authUser) {
    orderData.user = req.authUser._id;
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
  const orders = await Order.find({})
    .populate('user')
    .populate('paymentMethod')
    .populate('orderItems.product');
  
  // Format all orders with proper product images and details
  const formattedOrders = [];
  for (const order of orders) {
    const formattedOrder = await formatOrderData(order);
    formattedOrders.push(formattedOrder);
  }
  
  res.status(200).json({ success: true, orders: formattedOrders });
};

// Get my orders
const getMyOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.authUser._id })
    .populate('paymentMethod')
    .populate('orderItems.product');
  
  // Format all orders with proper product images and details
  const formattedOrders = [];
  for (const order of orders) {
    const formattedOrder = await formatOrderData(order);
    formattedOrders.push(formattedOrder);
  }
  
  res.status(200).json({ success: true, orders: formattedOrders });
};

// Get single order
const getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user')
    .populate('paymentMethod')
    .populate('orderItems.product');
    
  if (!order) return next(new NotFoundError('Order not found'));
  
  // Check if user is authorized to view this order
  if (order.user && order.user.toString() !== req.authUser._id.toString()) {
    return next(new UnauthorizedError('You are not authorized to view this order'));
  }
  
  // Format order data with proper product images and details
  const formattedOrder = await formatOrderData(order);
  
  res.status(200).json({ success: true, order: formattedOrder });
};

module.exports = {
  newOrder,
  getAdminOrders,
  getMyOrders,
  getSingleOrder,
};