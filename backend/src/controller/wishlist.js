const Wishlist = require('../models/wishlist');
const Product = require('../models/product');
const { NotFoundError, BadRequestError } = require('../utils/errors');

// 1. Add product to wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(new NotFoundError('Product not found'));

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = new Wishlist({ user: userId, products: [] });

    if (wishlist.products.some(p => p.product.toString() === productId)) {
      return res.status(200).json({ success: true, message: 'Already in wishlist' });
    }

    wishlist.products.push({ product: productId });
    await wishlist.save();
    res.status(200).json({ success: true, wishlist });
  } catch (err) { next(err); }
};

// 2. Remove product from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(p => p.product.toString() !== productId);
    await wishlist.save();
    res.status(200).json({ success: true, wishlist });
  } catch (err) { next(err); }
};

// 3. Get user wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products.product');
    res.status(200).json({ success: true, wishlist });
  } catch (err) { next(err); }
};

// 4. Check if product is in wishlist
exports.isInWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId });
    const isIn = wishlist && wishlist.products.some(p => p.product.toString() === productId);
    res.status(200).json({ success: true, isIn });
  } catch (err) { next(err); }
};
