const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { validate, validateCategory } = require('../utils/validators');
const { uploadImage } = require('../config/multer');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { uploadLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes
router.post('/', protect, isAdmin, uploadLimiter, uploadImage, validateCategory, validate, createCategory);
router.put('/:id', protect, isAdmin, uploadLimiter, uploadImage, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;