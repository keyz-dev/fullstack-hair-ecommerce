const Cart = require('../models/cart');
const Product = require('../models/product');
const { AppError, NotFoundError } = require('../utils/errors');

// Get user's cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.authUser._id }).populate('items.product');
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// Add item to cart
exports.addToCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.authUser._id });
    if (!cart) {
      cart = await Cart.create({ user: req.authUser._id, items: [] });
    }
    const { product, quantity } = req.body;
    const existingItem = cart.items.find(item => item.product.toString() === product);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }
    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res, next) => {
  try {
    const { product, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.authUser._id });
    if (!cart) return next(new NotFoundError('Cart not found'));
    const item = cart.items.find(item => item.product.toString() === product);
    if (!item) return next(new NotFoundError('Product not in cart'));
    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== product);
    } else {
      item.quantity = quantity;
    }
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { product } = req.body;
    const cart = await Cart.findOne({ user: req.authUser._id });
    if (!cart) return next(new NotFoundError('Cart not found'));
    cart.items = cart.items.filter(item => item.product.toString() !== product);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
}; 