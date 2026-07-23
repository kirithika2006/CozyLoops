const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  getAnalytics,
  trackView,
  getDailyStats
} = require('../controllers/analyticsController');

// Protected routes
router.get('/', protect, isAdmin, getAnalytics);
router.get('/daily', protect, isAdmin, getDailyStats);
router.post('/view', protect, isAdmin, trackView);

module.exports = router;