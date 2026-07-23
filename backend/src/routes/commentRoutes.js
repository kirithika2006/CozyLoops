const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { validate, validateComment } = require('../utils/validators');
const {
  addComment,
  getComments,
  deleteComment
} = require('../controllers/commentController');

// Public routes
router.post('/', validateComment, validate, addComment);
router.get('/', getComments);

// Protected routes
router.delete('/:id', protect, isAdmin, deleteComment);

module.exports = router;