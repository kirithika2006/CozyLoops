const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { validate, validateProduct } = require('../utils/validators');
const { uploadImages } = require('../config/multer');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { uploadLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, isAdmin, uploadLimiter, uploadImages, validateProduct, validate, createProduct);
router.put('/:id', protect, isAdmin, uploadLimiter, uploadImages, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;