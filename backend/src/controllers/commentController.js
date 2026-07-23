const Comment = require('../models/Comment');
const Product = require('../models/Product');
const Video = require('../models/Video');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Analytics = require('../models/Analytics');

const addComment = catchAsync(async (req, res, next) => {
  const { name, comment, type, typeId, rating } = req.body;

  let productName = '';
  
  // Validate type and typeId
  if (type === 'product') {
    const product = await Product.findById(typeId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    productName = product.name;
  } else if (type === 'video') {
    const video = await Video.findById(typeId);
    if (!video) {
      return next(new AppError('Video not found', 404));
    }
  } else if (type === 'general') {
    // General comment doesn't need typeId
  } else {
    return next(new AppError('Invalid comment type', 400));
  }

  const newComment = await Comment.create({
    name,
    comment,
    rating: rating || 5,
    type,
    typeId: typeId || null,
    typeModel: type === 'product' ? 'Product' : type === 'video' ? 'Video' : undefined,
    productName
  });

  // Update analytics
  await Analytics.findOneAndUpdate(
    {},
    { $inc: { totalComments: 1 } },
    { new: true, upsert: true }
  );

  // Update comment count on product/video
  if (type === 'product') {
    await Product.findByIdAndUpdate(typeId, { $inc: { totalReviews: 1 } });
  } else if (type === 'video') {
    await Video.findByIdAndUpdate(typeId, { $inc: { comments: 1 } });
  }

  res.status(201).json({
    success: true,
    comment: newComment
  });
});

const getComments = catchAsync(async (req, res, next) => {
  const { type, typeId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (type) filter.type = type;
  if (typeId) filter.typeId = typeId;

  const comments = await Comment.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    comments,
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

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  // Update comment count on product/video
  if (comment.type === 'product') {
    await Product.findByIdAndUpdate(comment.typeId, { $inc: { totalReviews: -1 } });
  } else if (comment.type === 'video') {
    await Video.findByIdAndUpdate(comment.typeId, { $inc: { comments: -1 } });
  }

  await comment.deleteOne();

  // Update analytics
  await Analytics.findOneAndUpdate(
    {},
    { $inc: { totalComments: -1 } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully'
  });
});

module.exports = {
  addComment,
  getComments,
  deleteComment
};