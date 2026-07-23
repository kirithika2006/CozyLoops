const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Analytics = require('../models/Analytics');

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  // Check if category exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(new AppError('Category already exists', 400));
  }

  let imageData = {};
  if (req.file) {
    // Upload to Cloudinary
    const base64String = req.file.buffer.toString('base64');
    const uploadResult = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${base64String}`, {
      folder: 'cozyloops/categories',
      resource_type: 'image',
      width: 400,
      height: 400,
      crop: 'fill'
    });
    imageData = {
      image: uploadResult.secure_url,
      publicId: uploadResult.public_id
    };
  }

  const category = await Category.create({
    name,
    description,
    ...imageData
  });

  // Update analytics
  await Analytics.findOneAndUpdate(
    {},
    { $inc: { totalCategories: 1 } },
    { new: true, upsert: true }
  );

  res.status(201).json({
    success: true,
    category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  let imageData = {};
  if (req.file) {
    // Delete old image from Cloudinary
    if (category.publicId && category.publicId !== 'placeholder') {
      await cloudinary.uploader.destroy(category.publicId);
    }

    // Upload new image to Cloudinary
    const base64String = req.file.buffer.toString('base64');
    const uploadResult = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${base64String}`, {
      folder: 'cozyloops/categories',
      resource_type: 'image',
      width: 400,
      height: 400,
      crop: 'fill'
    });
    imageData = {
      image: uploadResult.secure_url,
      publicId: uploadResult.public_id
    };
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      ...imageData
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    category: updatedCategory
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // Check if category has products
  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    return next(new AppError('Cannot delete category with existing products', 400));
  }

  // Delete image from Cloudinary
  if (category.publicId && category.publicId !== 'placeholder') {
    await cloudinary.uploader.destroy(category.publicId);
  }

  await category.deleteOne();

  // Update analytics
  await Analytics.findOneAndUpdate(
    {},
    { $inc: { totalCategories: -1 } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isActive: true })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    category
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};