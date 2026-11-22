const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { validate, validateAdminChangePassword } = require('../utils/validators');
const {
  changePassword,
  getProfile,
  initializeAdmin
} = require('../controllers/adminController');
const { authLimiter, ownerOtpRequestLimiter, ownerOtpVerifyLimiter } = require('../middleware/rateLimiter');
const { requestOwnerOtp, verifyOwnerOtp } = require('../controllers/adminController');

// Public routes
router.post('/login', authLimiter, (req, res) => {
  res.status(410).json({ success: false, message: 'Password login is no longer available. Use owner email verification.' });
});
router.post('/owner/request-otp', ownerOtpRequestLimiter, requestOwnerOtp);
router.post('/owner/verify-otp', ownerOtpVerifyLimiter, verifyOwnerOtp);
router.post('/init', async (req, res, next) => {
  if (!process.env.ADMIN_INIT_SECRET || req.get('x-admin-init-secret') !== process.env.ADMIN_INIT_SECRET) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  return initializeAdmin(req, res, next);
});

// Protected routes
router.get('/profile', protect, isAdmin, getProfile);
router.put('/change-password', protect, isAdmin, validateAdminChangePassword, validate, changePassword);

module.exports = router;
