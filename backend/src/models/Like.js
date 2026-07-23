const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['product', 'video'],
    required: true
  },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'typeModel',
    required: true
  },
  typeModel: {
    type: String,
    enum: ['Product', 'Video'],
    required: true
  },
  identifier: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one like per identifier per type
likeSchema.index({ type: 1, typeId: 1, identifier: 1 }, { unique: true });
likeSchema.index({ typeId: 1, type: 1 });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;