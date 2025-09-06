import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadProfilePicture, handleUploadError } from '../middleware/upload.js';
import rateLimiter from '../middleware/rateLimiter.js';
const router = express.Router();
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
    rateLimiter.auth,
    // Validation middleware
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 160 })
        .withMessage('Bio cannot exceed 160 characters')
], authController.register);
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
    rateLimiter.auth,
    body('loginField')
        .notEmpty()
        .withMessage('Email or username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
], authController.login);
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, authController.getMe);
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', [
    protect,
    uploadProfilePicture,
    handleUploadError,
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 160 })
        .withMessage('Bio cannot exceed 160 characters'),
    body('isPrivate')
        .optional()
        .isBoolean()
        .withMessage('isPrivate must be a boolean value')
], authController.updateProfile);
// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', [
    protect,
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
], authController.changePassword);
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, authController.logout);
// @desc    Delete account
// @route   DELETE /api/auth/delete-account
// @access  Private
router.delete('/delete-account', [
    protect,
    body('password')
        .notEmpty()
        .withMessage('Password is required to delete account')
], authController.deleteAccount);
// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
router.get('/stats', protect, authController.getUserStats);
export default router;
//# sourceMappingURL=authRoutes.js.map