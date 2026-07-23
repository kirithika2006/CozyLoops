const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [2, 'Comment must be at least 2 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  type: {
    type: String,
    enum: ['product', 'video', 'general'],
    default: 'general'
  },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'typeModel'
  },
  typeModel: {
    type: String,
    enum: ['Product', 'Video']
  },
  productName: {
    type: String,
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index
commentSchema.index({ type: 1, typeId: 1 });
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;