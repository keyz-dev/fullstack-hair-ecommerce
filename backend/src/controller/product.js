const Product = require("../models/product");
const {
  productCreateSchema,
  productUpdateSchema,
} = require("../schema/productSchema");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { formatProductData } = require("../utils/returnFormats/productData");
const { cleanUpFileImages } = require('../utils/imageCleanup')

// Create product
const createProduct = async (req, res, next) => {
  try{
    const { error } = productCreateSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));
    let images = req.files ? req.files.map((file) => file.path) : [];

    console.log("received data: ", {...req.body, images})

    const product = await Product.create({ ...req.body, images });
  
    res.status(201).json({ success: true, product });
  }catch(err){
    if(req.files) cleanUpFileImages(req)
    return next(err)
  }
};

// Get all products with pagination, filtering, sorting, and search
const getAllProducts = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search = "",
      category,
      isActive,
      stock,
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (stock === "in") query.stock = { $gt: 0 };
    if (stock === "out") query.stock = 0;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "_id name");

    res.status(200).json({
      success: true,
      data: {
        products: products.map(formatProductData),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Product stats for dashboard cards
const getProductStats = async (req, res, next) => {
  try {
    const total = await Product.countDocuments();
    const inStock = await Product.countDocuments({ stock: { $gt: 0 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    res.status(200).json({
      success: true,
      stats: {
        total,
        inStock,
        outOfStock,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get single product
const getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  res.status(200).json({ success: true, product });
};

// Update product
const updateProduct = async (req, res, next) => {
  const { error } = productUpdateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  let product = await Product.findById(req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  Object.assign(product, req.body);
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => file.path);
    product.images = [...(product.images || []), ...newImages];
  }
  await product.save();
  res
    .status(200)
    .json({ success: true, message: "Product updated successfully", product });
};

// Delete product
const deleteProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  await product.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
};
