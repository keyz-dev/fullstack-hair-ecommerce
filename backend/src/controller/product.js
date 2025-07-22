const Product = require('../models/product');
const { productCreateSchema, productUpdateSchema } = require('../schema/productSchema');
const { BadRequestError, NotFoundError } = require('../utils/errors');

// Create product
const createProduct = async (req, res, next) => {
  const { error } = productCreateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  let images = req.files ? req.files.map(file => file.path) : [];
  const product = await Product.create({ ...req.body, images });
  res.status(201).json({ success: true, message: 'Product created successfully', product });
};

// Get all products
const getAllProducts = async (req, res, next) => {
  const { limit, category } = req.query;
  const query = {};
  if (category) query.category = category;
  const products = await Product.find(query).limit(limit ? parseInt(limit) : 30);
  res.status(200).json({ success: true, products });
};

// Get single product
const getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.status(200).json({ success: true, product });
};

// Update product
const updateProduct = async (req, res, next) => {
  const { error } = productUpdateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  let product = await Product.findById(req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  Object.assign(product, req.body);
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => file.path);
    product.images = [...(product.images || []), ...newImages];
  }
  await product.save();
  res.status(200).json({ success: true, message: 'Product updated successfully', product });
};

// Delete product
const deleteProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted successfully' });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
