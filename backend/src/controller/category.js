const Category = require("../models/category");
const {
  categoryCreateSchema,
  categoryUpdateSchema,
} = require("../schema/categorySchema");
const { BadRequestError, NotFoundError } = require("../utils/errors");

// Create category
exports.addCategory = async (req, res, next) => {
  const { error, value } = categoryCreateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  let image = req.file ? req.file.path : undefined;

  console.log("Entry data: ", { ...value, image });
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
  const categories = await Category.find({});
  res.status(200).json({ success: true, data:  categories });
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
