const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { generateToken } = require('../utils/generateToken');

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if admin exists
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return next(new AppError('Invalid username or password', 401));
  }

  // Check password
  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid username or password', 401));
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  // Generate token
  const token = generateToken(admin._id, admin.isAdmin);

  res.status(200).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      isAdmin: admin.isAdmin,
      lastLogin: admin.lastLogin
    }
  });
});

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin._id;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    return next(new AppError('Admin not found', 404));
  }

  // Verify current password
  const isPasswordValid = await admin.comparePassword(currentPassword);
  if (!isPasswordValid) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getProfile = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin._id).select('-password');
  
  res.status(200).json({
    success: true,
    admin
  });
});

// @desc    Initialize admin (run once)
// @route   POST /api/admin/init
// @access  Public
const initializeAdmin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if admin already exists
  const adminExists = await Admin.findOne({ username });
  if (adminExists) {
    return next(new AppError('Admin already exists', 400));
  }

  const admin = await Admin.create({
    username,
    password
  });

  res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    admin: {
      id: admin._id,
      username: admin.username
    }
  });
});

module.exports = {
  login,
  changePassword,
  getProfile,
  initializeAdmin
};