const Category = require("../models/category");
const {
  categoryCreateSchema,
  categoryUpdateSchema,
} = require("../schema/categorySchema");
const { BadRequestError, NotFoundError } = require("../utils/errors");
const { formatImageUrl } = require("../utils/imageUtils");

// Create category
exports.addCategory = async (req, res, next) => {
  const { error, value } = categoryCreateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  let image = req.file ? req.file.path : undefined;

  const category = await Category.create({ ...value, image });
  res
    .status(201)
    .json({
      success: true,
      message: "Category created successfully",
      category,
    });
};

// Get single category
exports.readSingleCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new NotFoundError("Category not found"));
  res.status(200).json({ success: true, category });
};

// Update category
exports.updateCategory = async (req, res, next) => {
  const { error } = categoryUpdateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  let category = await Category.findById(req.params.id);
  if (!category) return next(new NotFoundError("Category not found"));
  const { name, description } = req.body;
  if (name) category.name = name;
  if (description) category.description = description;
  if (req.file) category.image = req.file.path;
  await category.save();
  res
    .status(200)
    .json({
      success: true,
      message: "Category updated successfully",
      category,
    });
};

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    const categoryIds = categories.map(cat => cat._id);

    // Get product counts per category
    const Product = require('../models/product');
    const productCounts = await Product.aggregate([
      { $match: { category: { $in: categoryIds } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const productCountMap = {};
    productCounts.forEach(pc => { productCountMap[pc._id.toString()] = pc.count; });

    // Get service counts per category
    const Service = require('../models/service');
    const serviceCounts = await Service.aggregate([
      { $match: { category: { $in: categoryIds } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const serviceCountMap = {};
    serviceCounts.forEach(sc => { serviceCountMap[sc._id.toString()] = sc.count; });

    // Format response
    const data = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      image: formatImageUrl(cat.image),
      description: cat.description,
      productCount: productCountMap[cat._id.toString()] || 0,
      serviceCount: serviceCountMap[cat._id.toString()] || 0,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Delete category
exports.deleteCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new NotFoundError("Category not found"));
  await category.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
};
