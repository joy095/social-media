import express from 'express';
import { body } from 'express-validator';
import adminController from '../controllers/adminController.js';
import { adminProtect, requirePermission, adminOnly, managerOrAdmin, accountantOrAbove, logAdminActivity } from '../middleware/adminAuth.js';
import rateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

// AUTHENTICATION

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
router.post('/login', [
  rateLimiter.auth,
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], adminController.login);

// EMPLOYEE MANAGEMENT

// @desc    Create new employee
// @route   POST /api/admin/employees
// @access  Private (Admin only)
router.post('/employees', [
  adminProtect,
  adminOnly,
  logAdminActivity('Create Employee'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('mobile')
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['admin', 'manager', 'accountant'])
    .withMessage('Role must be admin, manager, or accountant')
], adminController.createEmployee);

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private (Admin/Manager)
router.get('/employees', [
  adminProtect,
  managerOrAdmin
], adminController.getEmployees);

// @desc    Update employee
// @route   PUT /api/admin/employees/:id
// @access  Private (Admin only)
router.put('/employees/:id', [
  adminProtect,
  adminOnly,
  logAdminActivity('Update Employee'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('mobile')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'accountant'])
    .withMessage('Role must be admin, manager, or accountant'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
], adminController.updateEmployee);

// REVENUE MANAGEMENT

// @desc    Create/Update revenue pricing
// @route   POST /api/admin/revenue
// @access  Private (Admin/Manager)
router.post('/revenue', [
  adminProtect,
  managerOrAdmin,
  logAdminActivity('Set Revenue Pricing'),
  body('city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('City name is required'),
  body('pricePerView')
    .isFloat({ min: 0.01 })
    .withMessage('Price per view must be at least 0.01'),
  body('pricePerLike')
    .isFloat({ min: 0.01 })
    .withMessage('Price per like must be at least 0.01')
], adminController.setRevenuePricing);

// @desc    Get all revenue pricing
// @route   GET /api/admin/revenue
// @access  Private (Admin/Manager/Accountant)
router.get('/revenue', [
  adminProtect,
  accountantOrAbove
], adminController.getRevenuePricing);

// POST MANAGEMENT

// @desc    Get all posts for approval
// @route   GET /api/admin/posts
// @access  Private (Admin/Manager)
router.get('/posts', [
  adminProtect,
  managerOrAdmin
], adminController.getPosts);

// @desc    Approve post
// @route   PUT /api/admin/posts/:id/approve
// @access  Private (Admin/Manager)
router.put('/posts/:id/approve', [
  adminProtect,
  managerOrAdmin,
  logAdminActivity('Approve Post')
], adminController.approvePost);

// PAYMENT MANAGEMENT

// @desc    Get approved posts for payment
// @route   GET /api/admin/payments
// @access  Private (Admin/Manager/Accountant)
router.get('/payments', [
  adminProtect,
  accountantOrAbove
], adminController.getApprovedPosts);

// @desc    Process payment for posts
// @route   POST /api/admin/payments/process
// @access  Private (Admin/Accountant)
router.post('/payments/process', [
  adminProtect,
  requirePermission('manage_payments'),
  logAdminActivity('Process Payment'),
  body('userId')
    .isMongoId()
    .withMessage('Valid user ID is required'),
  body('postIds')
    .isArray({ min: 1 })
    .withMessage('At least one post ID is required'),
  body('postIds.*')
    .isMongoId()
    .withMessage('All post IDs must be valid'),
  body('paymentMethod')
    .isIn(['bank_transfer', 'paypal', 'crypto', 'check'])
    .withMessage('Invalid payment method'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  // Conditional validations based on payment method
  body('bankDetails')
    .if(body('paymentMethod').equals('bank_transfer'))
    .notEmpty()
    .withMessage('Bank details are required for bank transfer'),
  body('paypalEmail')
    .if(body('paymentMethod').equals('paypal'))
    .isEmail()
    .withMessage('Valid PayPal email is required'),
  body('cryptoAddress')
    .if(body('paymentMethod').equals('crypto'))
    .notEmpty()
    .withMessage('Crypto address is required for crypto payment')
], adminController.processPayment);

// @desc    Update payment status
// @route   PUT /api/admin/payments/:id/status
// @access  Private (Admin/Accountant)
router.put('/payments/:id/status', [
  adminProtect,
  requirePermission('manage_payments'),
  logAdminActivity('Update Payment Status'),
  body('status')
    .isIn(['pending', 'processing', 'completed', 'failed', 'cancelled'])
    .withMessage('Invalid payment status'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
], adminController.updatePaymentStatus);

// @desc    Get payment history
// @route   GET /api/admin/payments/history
// @access  Private (Admin/Manager/Accountant)
router.get('/payments/history', [
  adminProtect,
  accountantOrAbove
], adminController.getPaymentHistory);

// DASHBOARD & ANALYTICS

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin/Manager/Accountant)
router.get('/dashboard', [
  adminProtect,
  accountantOrAbove
], adminController.getDashboardStats);

// @desc    Get bot activity report
// @route   GET /api/admin/bot-activity
// @access  Private (Admin/Manager)
router.get('/bot-activity', [
  adminProtect,
  managerOrAdmin
], adminController.getBotActivityReport);

export default router;
