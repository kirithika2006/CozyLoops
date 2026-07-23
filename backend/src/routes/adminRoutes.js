const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { validate, validateAdminLogin, validateAdminChangePassword } = require('../utils/validators');
const {
  login,
  changePassword,
  getProfile,
  initializeAdmin
} = require('../controllers/adminController');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/login', authLimiter, validateAdminLogin, validate, login);
router.post('/init', initializeAdmin);

// Protected routes
router.get('/profile', protect, isAdmin, getProfile);
router.put('/change-password', protect, isAdmin, validateAdminChangePassword, validate, changePassword);

module.exports = router;