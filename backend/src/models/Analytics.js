const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  totalProducts: {
    type: Number,
    default: 0
  },
  totalVideos: {
    type: Number,
    default: 0
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number,
    default: 0
  },
  totalCategories: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },
  latestUploads: {
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    videos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    }]
  },
  dailyStats: [{
    date: {
      type: Date,
      default: Date.now
    },
    views: {
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
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one analytics document exists
analyticsSchema.pre('save', async function(next) {
  const doc = this;
  const count = await mongoose.model('Analytics').countDocuments();
  if (count > 0 && doc.isNew) {
    return next(new Error('Only one analytics document can exist'));
  }
  next();
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;