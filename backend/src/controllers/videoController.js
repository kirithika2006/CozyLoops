const Video = require('../models/Video');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Analytics = require('../models/Analytics');
const fs = require('fs');
const path = require('path');

// Helper function to get file URL
const getFileUrl = (file, req) => {
  if (!file) return null;
  const relativePath = file.path.replace(/^.*?\\uploads/, 'uploads');
  return `${req.protocol}://${req.get('host')}/${relativePath.replace(/\\/g, '/')}`;
};

// @desc    Upload video
// @route   POST /api/videos
// @access  Private
const uploadVideo = catchAsync(async (req, res, next) => {
  console.log('📹 Uploading video...');
  console.log('Request body:', req.body);
  console.log('Files:', req.files ? Object.keys(req.files) : 'No files');

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

  // Get file URLs
  const videoUrl = getFileUrl(videoFile, req);
  const thumbnailUrl = getFileUrl(thumbnailFile, req);

  // Parse hashtags
  let hashtagsArray = [];
  if (hashtags) {
    try {
      hashtagsArray = typeof hashtags === 'string' ? JSON.parse(hashtags) : hashtags;
    } catch (e) {
      // If parsing fails, treat as comma-separated string
      hashtagsArray = hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
  }

  // Create video data
  const videoData = {
    title: title.trim(),
    description: description.trim(),
    videoUrl: videoUrl,
    publicId: videoFile.filename,
    thumbnail: thumbnailUrl,
    thumbnailPublicId: thumbnailFile.filename,
    category: category || 'General',
    hashtags: hashtagsArray || [],
    duration: 0,
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

  // Increment views
  video.views += 1;
  await video.save();

  res.status(200).json({
    success: true,
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
    const thumbnailUrl = getFileUrl(req.file, req);
    updateData.thumbnail = thumbnailUrl;
    updateData.thumbnailPublicId = req.file.filename;
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

  // Delete video file from storage
  const videoPath = path.join(__dirname, '../../uploads/videos', path.basename(video.videoUrl));
  if (fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
  }

  // Delete thumbnail file from storage
  const thumbnailPath = path.join(__dirname, '../../uploads/images', path.basename(video.thumbnail));
  if (fs.existsSync(thumbnailPath)) {
    fs.unlinkSync(thumbnailPath);
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
    // Unlike
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

  // Like
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