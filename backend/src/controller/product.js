const Product = require('../models/product');
const Review = require('../models/review');
const Wishlist = require('../models/wishlist');
const { formatProductData } = require('../utils/returnFormats/productData');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const { productCreateSchema, productUpdateSchema } = require('../schema/productSchema');
const { cleanUpFileImages } = require('../utils/imageCleanup')

// Create product
const createProduct = async (req, res, next) => {
  try {
    const { error } = productCreateSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const formData = req.body;
    const productImages = req.files ? req.files.map(file => file.path) : [];

    // Generate slug from name
    const slug = formData.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Parse JSON fields from form data
    let variants = [];
    let features = [];
    let specifications = {};
    let tags = [];

    try {
      if (formData.variants) {
        variants = typeof formData.variants === 'string' 
          ? JSON.parse(formData.variants) 
          : formData.variants;
      }
    } catch (err) {
      return next(new BadRequestError("Invalid variants data"));
    }

    try {
      if (formData.features) {
        features = typeof formData.features === 'string' 
          ? JSON.parse(formData.features) 
          : formData.features;
      }
    } catch (err) {
      return next(new BadRequestError("Invalid features data"));
    }

    try {
      if (formData.specifications) {
        specifications = typeof formData.specifications === 'string' 
          ? JSON.parse(formData.specifications) 
          : formData.specifications;
      }
    } catch (err) {
      return next(new BadRequestError("Invalid specifications data"));
    }

    // Handle tags - can be array or comma-separated string
    if (formData.tags) {
      tags = Array.isArray(formData.tags) 
        ? formData.tags 
        : formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const product = new Product({
      ...formData,
      images: productImages,
      slug,
      variants,
      features,
      specifications,
      tags,
    });

    await product.save();
    const formattedProduct = await formatProductData(product);
  
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: formattedProduct,
    });
  } catch (err) {
    if(req.files) cleanUpFileImages(req)
    next(err);
  }
};

// Get all products with pagination, filtering, sorting, and search
const getAllProducts = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 5,
      sort = "-createdAt",
      search = "",
      category,
      isActive,
      stock,
      stock_status,
      isFeatured,
      isOnSale,
      tags,
      minPrice,
      maxPrice,
      price_range,
    } = req.query;
    
    page = parseInt(page);
    limit = parseInt(limit);
    const query = {};
    
    if (category && category !== 'all' && category !== '') query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (isOnSale !== undefined) query.isOnSale = isOnSale === "true";
    // Handle stock status filter
    if (stock_status) {
      if (stock_status === "in_stock") {
        query.stock = { $gt: 10 };
      } else if (stock_status === "limited_stock") {
        query.stock = { $gt: 0, $lte: 10 };
      } else if (stock_status === "out_of_stock") {
        query.stock = 0;
      }
    } else if (stock === "in") query.stock = { $gt: 0 };
    else if (stock === "out") query.stock = 0;

    // Handle price range filter
    if (price_range) {
      query.price = {};
      if (price_range === "low") {
        query.price.$lt = 50;
      } else if (price_range === "medium") {
        query.price.$gte = 50;
        query.price.$lte = 200;
      } else if (price_range === "high") {
        query.price.$gt = 200;
      }
    } else if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }
    
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "_id name");

    // Format products with currency information
    const formattedProducts = await Promise.all(products.map(formatProductData));

    res.status(200).json({
      success: true,
      data: {
        products: formattedProducts,
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

// Get single product with reviews
const getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "_id name")
      .populate({
        path: "reviews",
        match: { isActive: true },
        populate: {
          path: "user",
          select: "name avatar"
        },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!product) return next(new NotFoundError("Product not found"));

    // Calculate average rating
    const reviews = await Review.find({ product: product._id, isActive: true });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Update product rating
    product.rating = Math.round(avgRating * 10) / 10;
    product.reviewCount = reviews.length;
    await product.save();

    const formattedProduct = await formatProductData(product);

    res.status(200).json({
      success: true,
      product: formattedProduct 
    });
  } catch (err) {
    next(err);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const { error } = productUpdateSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));
    
    let product = await Product.findById(req.params.id);
    if (!product) return next(new NotFoundError("Product not found"));
    
    const formData = req.body;
    
    // Handle existing images
    if (formData.existingImages) {
      try {
        const existingImages = JSON.parse(formData.existingImages);
        product.images = existingImages;
      } catch (err) {
        return next(new BadRequestError("Invalid existing images data"));
      }
    }
    
    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      product.images = [...(product.images || []), ...newImages];
    }
    
    // Generate slug if name changed
    if (formData.name && formData.name !== product.name) {
      const slug = formData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      formData.slug = slug;
    }
    
    // Parse JSON fields from form data
    try {
      if (formData.variants) {
        formData.variants = typeof formData.variants === 'string' 
          ? JSON.parse(formData.variants) 
          : formData.variants;
      }
    } catch (err) {
      return next(new BadRequestError("Invalid variants data"));
    }
    
    try {
      if (formData.features) {
        formData.features = typeof formData.features === 'string' 
          ? JSON.parse(formData.features) 
          : formData.features;
      }
    } catch (err) {
      return next(new BadRequestError("Invalid features data"));
    }
    
    try {
      if (formData.specifications) {
        formData.specifications = typeof formData.specifications === 'string' 
          ? JSON.parse(formData.specifications) 
          : formData.specifications;
      }
    } catch (err) {
      return next(new BadRequestError("Invalid specifications data"));
    }
    
    // Handle tags - can be array or comma-separated string
    if (formData.tags) {
      formData.tags = Array.isArray(formData.tags) 
        ? formData.tags 
        : formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // Update product
    Object.assign(product, formData);
    await product.save();
    
    const formattedProduct = await formatProductData(product);
    
    res.status(200).json({ 
      success: true, 
      message: "Product updated successfully", 
      product: formattedProduct 
    });
  } catch (err) {
    next(err);
  }
};

// Delete product
const deleteProduct = async (req, res, next) => {
  try {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
    
    // Delete associated reviews
    await Review.deleteMany({ product: product._id });
    
    // Remove from wishlists
    await Wishlist.updateMany(
      { 'products.product': product._id },
      { $pull: { products: { product: product._id } } }
    );
    
  await product.deleteOne();
    
    res.status(200).json({ 
      success: true, 
      message: "Product deleted successfully" 
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
    const featured = await Product.countDocuments({ isFeatured: true, isActive: true });
    const onSale = await Product.countDocuments({ isOnSale: true, isActive: true });
    
    res.status(200).json({
      success: true,
      stats: {
        total,
        inStock,
        outOfStock,
        featured,
        onSale,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get product reviews
const getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reviews = await Review.find({ 
      product: req.params.id, 
      isActive: true 
    })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await Review.countDocuments({ 
      product: req.params.id, 
      isActive: true 
    });
    
    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getProductReviews,
};
