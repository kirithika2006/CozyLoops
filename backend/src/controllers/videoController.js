const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Analytics = require('../models/Analytics');

// @desc    Upload video
// @route   POST /api/videos
// @access  Private
const uploadVideo = catchAsync(async (req, res, next) => {
  console.log('📹 Uploading video...');
  console.log('Request body:', req.body);

  const { title, description, category, hashtags } = req.body;

  // Validate required fields
  if (!title || !title.trim()) {
    return next(new AppError('Title is required', 400));
  }
  if (!description || !description.trim()) {
    return next(new AppError('Description is required', 400));
  }

  // Check if files exist
  if (!req.files) {
    return next(new AppError('Please upload both video and thumbnail', 400));
  }

  if (!req.files.video) {
    return next(new AppError('Video file is required', 400));
  }

  if (!req.files.thumbnail) {
    return next(new AppError('Thumbnail image is required', 400));
  }

  const videoFile = req.files.video[0];
  const thumbnailFile = req.files.thumbnail[0];

  // Upload video to Cloudinary
  console.log('📤 Uploading video to Cloudinary...');
  const videoBase64 = videoFile.buffer.toString('base64');
  const videoUploadResult = await cloudinary.uploader.upload(`data:${videoFile.mimetype};base64,${videoBase64}`, {
    folder: 'cozyloops/videos',
    resource_type: 'video',
    eager: [
      { width: 720, height: 480, crop: 'limit' },
      { width: 480, height: 320, crop: 'limit' }
    ],
    eager_async: true
  });

  // Upload thumbnail to Cloudinary
  console.log('📤 Uploading thumbnail to Cloudinary...');
  const thumbBase64 = thumbnailFile.buffer.toString('base64');
  const thumbUploadResult = await cloudinary.uploader.upload(`data:${thumbnailFile.mimetype};base64,${thumbBase64}`, {
    folder: 'cozyloops/videos/thumbnails',
    resource_type: 'image',
    width: 600,
    height: 600,
    crop: 'fill'
  });

  // Get video duration
  const duration = Math.round(videoUploadResult.duration || 0);
  if (duration > 180) {
    return next(new AppError('Video duration exceeds 3 minutes limit', 400));
  }

  // Parse hashtags
  let hashtagsArray = [];
  if (hashtags) {
    try {
      hashtagsArray = typeof hashtags === 'string' ? JSON.parse(hashtags) : hashtags;
    } catch (e) {
      hashtagsArray = hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
  }

  // Create video data
  const videoData = {
    title: title.trim(),
    description: description.trim(),
    videoUrl: videoUploadResult.secure_url,
    publicId: videoUploadResult.public_id,
    thumbnail: thumbUploadResult.secure_url,
    thumbnailPublicId: thumbUploadResult.public_id,
    category: category || 'General',
    hashtags: hashtagsArray || [],
    duration: duration,
    isActive: true
  };

  console.log('📝 Video data:', videoData);

  const video = await Video.create(videoData);

  // Update analytics
  await Analytics.findOneAndUpdate(
    {},
    { 
      $inc: { totalVideos: 1 },
      $push: { 'latestUploads.videos': video._id }
    },
    { new: true, upsert: true }
  );

  console.log('✅ Video uploaded successfully:', video._id);

  res.status(201).json({
    success: true,
    message: 'Video uploaded successfully',
    video
  });
});

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
const updateVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('Video not found', 404));
  }

  const updateData = { ...req.body };
  
  // Update thumbnail if uploaded
  if (req.file) {
    // Delete old thumbnail from Cloudinary
    if (video.thumbnailPublicId) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId);
    }

    // Upload new thumbnail to Cloudinary
    const base64String = req.file.buffer.toString('base64');
    const uploadResult = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${base64String}`, {
      folder: 'cozyloops/videos/thumbnails',
      resource_type: 'image',
      width: 600,
      height: 600,
      crop: 'fill'
    });

    updateData.thumbnail = uploadResult.secure_url;
    updateData.thumbnailPublicId = uploadResult.public_id;
  }

  // Parse hashtags if provided
  if (updateData.hashtags) {
    try {
      updateData.hashtags = typeof updateData.hashtags === 'string' 
        ? JSON.parse(updateData.hashtags) 
        : updateData.hashtags;
    } catch (e) {
      updateData.hashtags = updateData.hashtags.split(',').map(tag => tag.trim());
    }
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Video updated successfully',
    video: updatedVideo
  });
});

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('Video not found', 404));
  }

  // Delete video from Cloudinary
  if (video.publicId) {
    await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
  }

  // Delete thumbnail from Cloudinary
  if (video.thumbnailPublicId) {
    await cloudinary.uploader.destroy(video.thumbnailPublicId);
  }

  // Delete video from database
  await video.deleteOne();

  // Update analytics
  await Analytics.findOneAndUpdate(
    {},
    { 
      $inc: { totalVideos: -1 },
      $pull: { 'latestUploads.videos': video._id }
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Video deleted successfully'
  });
});

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const videos = await Video.find(filter)
    .sort({ uploadedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Video.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    videos,
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

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
const getVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('Video not found', 404));
  }

  video.views += 1;
  await video.save();

  res.status(200).json({
    success: true,
    video
  });
});

// @desc    Like/Unlike video
// @route   POST /api/videos/:id/like
// @access  Public
const toggleLike = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('Video not found', 404));
  }

  const { identifier } = req.body;
  if (!identifier) {
    return next(new AppError('Identifier is required', 400));
  }

  const Like = require('../models/Like');
  const existingLike = await Like.findOne({
    type: 'video',
    typeId: video._id,
    identifier
  });

  if (existingLike) {
    await existingLike.deleteOne();
    video.likes -= 1;
    await video.save();

    await Analytics.findOneAndUpdate(
      {},
      { $inc: { totalLikes: -1 } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      liked: false,
      likes: video.likes
    });
  }

  await Like.create({
    type: 'video',
    typeId: video._id,
    typeModel: 'Video',
    identifier
  });

  video.likes += 1;
  await video.save();

  await Analytics.findOneAndUpdate(
    {},
    { $inc: { totalLikes: 1 } },
    { new: true, upsert: true }
  );

  res.status(200).json({
    success: true,
    liked: true,
    likes: video.likes
  });
});

// @desc    Get video likes count
// @route   GET /api/videos/:id/likes
// @access  Public
const getLikes = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('Video not found', 404));
  }

  res.status(200).json({
    success: true,
    likes: video.likes
  });
});

module.exports = {
  uploadVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  toggleLike,
  getLikes
};