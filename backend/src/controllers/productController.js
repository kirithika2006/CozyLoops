const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Analytics = require('../models/Analytics');

// @desc    Create product
// @route   POST /api/products
// @access  Private
const createProduct = catchAsync(async (req, res, next) => {
  console.log('📦 Creating product...');
  console.log('Request body:', req.body);

  const {
    name,
    description,
    category,
    price,
    discount,
    stock,
    sku,
    material,
    weight,
    dimensions,
    colorsAvailable,
    sizesAvailable,
    estimatedDelivery,
    careInstructions,
    customizable,
    tags,
    isFeatured,
    isTrending,
    isNewArrival
  } = req.body;

  // Validate required fields
  if (!name || !description || !category || !price || !stock || !sku || !material || !weight) {
    return next(new AppError('Please fill in all required fields', 400));
  }

  // Check if category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError('Category not found', 404));
  }

  // Check if SKU exists
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    return next(new AppError('Product with this SKU already exists', 400));
  }

  // Upload images to Cloudinary
  let images = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(async (file) => {
      // Convert buffer to base64 for Cloudinary upload
      const base64String = file.buffer.toString('base64');
      const uploadResult = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64String}`, {
        folder: 'cozyloops/products',
        resource_type: 'image',
        width: 800,
        height: 800,
        crop: 'fill',
        quality: 'auto'
      });
      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    });
    images = await Promise.all(uploadPromises);
    console.log(`✅ Uploaded ${images.length} images to Cloudinary`);
  }

  // Parse JSON fields
  const parseJSON = (data) => {
    try {
      return data ? JSON.parse(data) : undefined;
    } catch (e) {
      return data;
    }
  };

  // Create product
  const productData = {
    name: name.trim(),
    description: description.trim(),
    category,
    price: parseFloat(price),
    discount: parseFloat(discount) || 0,
    stock: parseInt(stock),
    sku: sku.trim(),
    material: material.trim(),
    weight: parseFloat(weight),
    dimensions: dimensions ? parseJSON(dimensions) : undefined,
    colorsAvailable: colorsAvailable ? parseJSON(colorsAvailable) : [],
    sizesAvailable: sizesAvailable ? parseJSON(sizesAvailable) : [],
    estimatedDelivery: estimatedDelivery || '3-5 business days',
    careInstructions: careInstructions || '',
    customizable: customizable === 'true' || customizable === true,
    tags: tags ? parseJSON(tags) : [],
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isTrending: isTrending === 'true' || isTrending === true,
    isNewArrival: isNewArrival === 'true' || isNewArrival === true,
    isAvailable: true,
    images
  };

  const product = await Product.create(productData);

  // Update category product count
  categoryExists.productCount += 1;
  await categoryExists.save();

  // Update analytics
  await Analytics.findOneAndUpdate(
    {},
    { 
      $inc: { totalProducts: 1 },
      $push: { 'latestUploads.products': product._id }
    },
    { new: true, upsert: true }
  );

  console.log('✅ Product created successfully:', product._id);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = catchAsync(async (req, res, next) => {
  console.log('📦 Updating product...');
  
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const updateData = { ...req.body };
  
  // Handle images if uploaded
  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary
    for (const image of product.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    // Upload new images to Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const base64String = file.buffer.toString('base64');
      const uploadResult = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64String}`, {
        folder: 'cozyloops/products',
        resource_type: 'image',
        width: 800,
        height: 800,
        crop: 'fill',
        quality: 'auto'
      });
      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    });
    updateData.images = await Promise.all(uploadPromises);
  }

  // Parse JSON fields
  ['dimensions', 'colorsAvailable', 'sizesAvailable', 'tags'].forEach(field => {
    if (updateData[field]) {
      try {
        updateData[field] = JSON.parse(updateData[field]);
      } catch (e) {
        // Keep as is
      }
    }
  });

  // Parse boolean fields
  ['customizable', 'isFeatured', 'isTrending', 'isNewArrival', 'isAvailable'].forEach(field => {
    if (updateData[field] !== undefined) {
      updateData[field] = updateData[field] === 'true' || updateData[field] === true;
    }
  });

  // Parse number fields
  ['price', 'discount', 'stock', 'weight'].forEach(field => {
    if (updateData[field] !== undefined) {
      updateData[field] = parseFloat(updateData[field]);
    }
  });

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('category', 'name');

  console.log('✅ Product updated successfully:', updatedProduct._id);

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product: updatedProduct
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Delete images from Cloudinary
  for (const image of product.images) {
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }
  }

  // Update category product count
  await Category.findByIdAndUpdate(product.category, {
    $inc: { productCount: -1 }
  });

  // Delete product
  await product.deleteOne();

  // Update analytics
  await Analytics.findOneAndUpdate(
    {},
    { 
      $inc: { totalProducts: -1 },
      $pull: { 'latestUploads.products': product._id }
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || '-createdAt';

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isFeatured === 'true') filter.isFeatured = true;
  if (req.query.isTrending === 'true') filter.isTrending = true;
  if (req.query.isNewArrival === 'true') filter.isNewArrival = true;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }
  if (req.query.isAvailable === 'true') filter.isAvailable = true;

  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name description');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  product.views += 1;
  await product.save();

  res.status(200).json({
    success: true,
    product
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};