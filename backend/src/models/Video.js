const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Video description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  publicId: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  thumbnailPublicId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  hashtags: [{
    type: String,
    trim: true
  }],
  duration: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for short description - FIXED: Add null check
videoSchema.virtual('shortDescription').get(function() {
  if (!this.description) return '';
  return this.description.length > 150 
    ? this.description.substring(0, 150) + '...' 
    : this.description;
});

// Indexes
videoSchema.index({ title: 'text', description: 'text', hashtags: 'text' });
videoSchema.index({ category: 1 });
videoSchema.index({ uploadedAt: -1 });
videoSchema.index({ likes: -1 });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;