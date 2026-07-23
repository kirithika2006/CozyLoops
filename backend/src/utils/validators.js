const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('price').isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price must be greater than 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('material').trim().notEmpty().withMessage('Material is required'),
  body('weight').isNumeric().withMessage('Weight must be a number'),
];

const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  body('description').trim().notEmpty().withMessage('Category description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
];

const validateVideo = [
  body('title').trim().notEmpty().withMessage('Video title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('hashtags').optional().isArray().withMessage('Hashtags must be an array'),
];

const validateComment = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('comment').trim().notEmpty().withMessage('Comment is required')
    .isLength({ min: 2, max: 500 }).withMessage('Comment must be between 2 and 500 characters'),
];

const validateAdminLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateAdminChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    console.log('❌ Validation errors:', errorMessages);
    return res.status(400).json({
      success: false,
      errors: errorMessages
    });
  }
  next();
};

module.exports = {
  validateProduct,
  validateCategory,
  validateVideo,
  validateComment,
  validateAdminLogin,
  validateAdminChangePassword,
  validate
};