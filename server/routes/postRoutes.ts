import express from 'express';
import { body } from 'express-validator';
import postController from '../controllers/postController';
import { protect } from '../middleware/auth';
import { uploadPostMedia, handleUploadError } from '../middleware/upload';
import rateLimiter from '../middleware/rateLimiter';

const router = express.Router();

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
router.post('/', [
  protect,
  rateLimiter.post,
  uploadPostMedia,
  handleUploadError,
  body('content')
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage('Post content must be between 1 and 280 characters'),
  body('visibility')
    .optional()
    .isIn(['public', 'followers', 'private'])
    .withMessage('Visibility must be public, followers, or private')
], postController.createPost);

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Private
router.get('/', [
  protect,
  rateLimiter.general
], postController.getPosts);

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Private
router.get('/search', [
  protect,
  rateLimiter.general
], postController.searchPosts);

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
router.get('/:id', [
  protect,
  rateLimiter.general
], postController.getPost);

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', [
  protect,
  rateLimiter.post,
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage('Post content must be between 1 and 280 characters'),
  body('visibility')
    .optional()
    .isIn(['public', 'followers', 'private'])
    .withMessage('Visibility must be public, followers, or private')
], postController.updatePost);

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', [
  protect,
  rateLimiter.general
], postController.deletePost);

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Private
router.get('/user/:userId', [
  protect,
  rateLimiter.general
], postController.getUserPosts);

// @desc    Record post view
// @route   POST /api/posts/:id/view
// @access  Private
router.post('/:id/view', [
  protect,
  rateLimiter.interaction,
  body('duration')
    .optional()
    .isNumeric()
    .withMessage('Duration must be a number'),
  body('screenPercentage')
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Screen percentage must be between 0 and 100')
], postController.recordView);

export default router;
