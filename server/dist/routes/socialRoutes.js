import express from 'express';
import { body } from 'express-validator';
import socialController from '../controllers/socialController';
import { protect } from '../middleware/auth';
import rateLimiter from '../middleware/rateLimiter';
const router = express.Router();
// POST INTERACTIONS
// @desc    Toggle like on post
// @route   POST /api/social/posts/:id/like
// @access  Private
router.post('/posts/:id/like', [
    protect,
    rateLimiter.interaction
], socialController.togglePostLike);
// @desc    Get post likes
// @route   GET /api/social/posts/:id/likes
// @access  Private
router.get('/posts/:id/likes', [
    protect,
    rateLimiter.general
], socialController.getPostLikes);
// COMMENT MANAGEMENT
// @desc    Add comment to post
// @route   POST /api/social/posts/:id/comments
// @access  Private
router.post('/posts/:id/comments', [
    protect,
    rateLimiter.interaction,
    body('content')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Comment must be between 1 and 500 characters'),
    body('parentComment')
        .optional()
        .isMongoId()
        .withMessage('Parent comment must be a valid ID')
], socialController.addComment);
// @desc    Get post comments
// @route   GET /api/social/posts/:id/comments
// @access  Private
router.get('/posts/:id/comments', [
    protect,
    rateLimiter.general
], socialController.getPostComments);
// @desc    Get comment replies
// @route   GET /api/social/comments/:id/replies
// @access  Private
router.get('/comments/:id/replies', [
    protect,
    rateLimiter.general
], socialController.getCommentReplies);
// @desc    Update comment
// @route   PUT /api/social/comments/:id
// @access  Private
router.put('/comments/:id', [
    protect,
    rateLimiter.interaction,
    body('content')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Comment must be between 1 and 500 characters')
], socialController.updateComment);
// @desc    Delete comment
// @route   DELETE /api/social/comments/:id
// @access  Private
router.delete('/comments/:id', [
    protect,
    rateLimiter.general
], socialController.deleteComment);
// @desc    Toggle like on comment
// @route   POST /api/social/comments/:id/like
// @access  Private
router.post('/comments/:id/like', [
    protect,
    rateLimiter.interaction
], socialController.toggleCommentLike);
// USER FOLLOWING
// @desc    Follow user
// @route   POST /api/social/users/:id/follow
// @access  Private
router.post('/users/:id/follow', [
    protect,
    rateLimiter.interaction
], socialController.followUser);
// @desc    Unfollow user
// @route   DELETE /api/social/users/:id/follow
// @access  Private
router.delete('/users/:id/follow', [
    protect,
    rateLimiter.interaction
], socialController.unfollowUser);
// @desc    Get user followers
// @route   GET /api/social/users/:id/followers
// @access  Private
router.get('/users/:id/followers', [
    protect,
    rateLimiter.general
], socialController.getUserFollowers);
// @desc    Get user following
// @route   GET /api/social/users/:id/following
// @access  Private
router.get('/users/:id/following', [
    protect,
    rateLimiter.general
], socialController.getUserFollowing);
// @desc    Get follow suggestions
// @route   GET /api/social/suggestions
// @access  Private
router.get('/suggestions', [
    protect,
    rateLimiter.general
], socialController.getFollowSuggestions);
export default router;
//# sourceMappingURL=socialRoutes.js.map