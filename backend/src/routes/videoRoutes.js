const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { uploadMixed, uploadImage } = require('../config/multer');
const {
  uploadVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  toggleLike,
  getLikes
} = require('../controllers/videoController');
const { uploadLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/', getVideos);
router.get('/:id', getVideo);
router.get('/:id/likes', getLikes);
router.post('/:id/like', toggleLike);

// Protected routes - Admin only (Remove validation for testing)
router.post('/', protect, isAdmin, uploadLimiter, uploadMixed, uploadVideo);
router.put('/:id', protect, isAdmin, uploadLimiter, uploadImage, updateVideo);
router.delete('/:id', protect, isAdmin, deleteVideo);

module.exports = router;