import { validationResult } from 'express-validator';
import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Revenue } from '../models/Revenue.js';
import { Payment } from '../models/Payment.js';
import { generateToken } from '../utils/generateToken.js';
class AdminController {
    // @desc    Admin login
    // @route   POST /api/admin/login
    // @access  Public
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            const { email, password } = req.body;
            // Find employee by email
            const employee = await Employee.findOne({ email }).select('+password');
            if (!employee) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            // Check if account is locked
            if (employee.isLocked) {
                return res.status(423).json({
                    success: false,
                    message: 'Account is locked due to too many failed login attempts'
                });
            }
            // Check if account is active
            if (!employee.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated'
                });
            }
            // Verify password
            if (!(await employee.comparePassword(password))) {
                await employee.incLoginAttempts();
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            // Reset login attempts on successful login
            await employee.resetLoginAttempts();
            // Generate JWT token
            const token = generateToken(employee._id, 'employee');
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    employee,
                    token
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Create new employee
    // @route   POST /api/admin/employees
    // @access  Private (Admin only)
    async createEmployee(req, res, next) {
        try {
            // Check permission
            if (!req.employee.hasPermission('create_employee')) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            const { name, email, mobile, password, role } = req.body;
            // Check if employee already exists
            const existingEmployee = await Employee.findOne({ email });
            if (existingEmployee) {
                return res.status(400).json({
                    success: false,
                    message: 'Employee with this email already exists'
                });
            }
            // Create employee
            const employee = await Employee.create({
                name,
                email,
                mobile,
                password,
                role,
                createdBy: req.employee.id
            });
            res.status(201).json({
                success: true,
                message: 'Employee created successfully',
                data: employee
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get all employees
    // @route   GET /api/admin/employees
    // @access  Private (Admin/Manager)
    async getEmployees(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const query = {};
            // Filter by role if specified
            if (req.query.role) {
                query.role = req.query.role;
            }
            // Filter by active status
            if (req.query.isActive !== undefined) {
                query.isActive = req.query.isActive === 'true';
            }
            const employees = await Employee.find(query)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const totalEmployees = await Employee.countDocuments(query);
            res.status(200).json({
                success: true,
                data: employees,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalEmployees / limit),
                    totalEmployees,
                    hasNextPage: page < Math.ceil(totalEmployees / limit),
                    hasPrevPage: page > 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Update employee
    // @route   PUT /api/admin/employees/:id
    // @access  Private (Admin only)
    async updateEmployee(req, res, next) {
        try {
            if (!req.employee.hasPermission('create_employee')) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }
            const { name, email, mobile, role, isActive } = req.body;
            const updateData = {};
            if (name)
                updateData.name = name;
            if (email)
                updateData.email = email;
            if (mobile)
                updateData.mobile = mobile;
            if (role)
                updateData.role = role;
            if (isActive !== undefined)
                updateData.isActive = isActive;
            const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
            res.status(200).json({
                success: true,
                message: 'Employee updated successfully',
                data: updatedEmployee
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Create/Update revenue pricing
    // @route   POST /api/admin/revenue
    // @access  Private (Admin/Manager)
    async setRevenuePricing(req, res, next) {
        try {
            if (!req.employee.hasPermission('manage_revenue')) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            const { city, pricePerView, pricePerLike } = req.body;
            // Check if pricing for this city already exists
            let revenue = await Revenue.findOne({ city: city.toUpperCase() });
            if (revenue) {
                // Update existing pricing
                revenue.pricePerView = pricePerView;
                revenue.pricePerLike = pricePerLike;
                revenue.updatedBy = req.employee.id;
                await revenue.save();
            }
            else {
                // Create new pricing
                revenue = await Revenue.create({
                    city: city.toUpperCase(),
                    pricePerView,
                    pricePerLike,
                    createdBy: req.employee.id
                });
            }
            res.status(200).json({
                success: true,
                message: 'Revenue pricing set successfully',
                data: revenue
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get all revenue pricing
    // @route   GET /api/admin/revenue
    // @access  Private (Admin/Manager/Accountant)
    async getRevenuePricing(req, res, next) {
        try {
            const pricing = await Revenue.find({ isActive: true })
                .populate('createdBy', 'name')
                .populate('updatedBy', 'name')
                .sort({ city: 1 });
            res.status(200).json({
                success: true,
                data: pricing
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get all posts for approval
    // @route   GET /api/admin/posts
    // @access  Private (Admin/Manager)
    async getPosts(req, res, next) {
        try {
            if (!req.employee.hasPermission('view_posts')) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const query = { isActive: true };
            // Filter by approval status
            if (req.query.isApproved !== undefined) {
                query.isApproved = req.query.isApproved === 'true';
            }
            // Filter by payment status
            if (req.query.isPaid !== undefined) {
                query.isPaid = req.query.isPaid === 'true';
            }
            // Filter by location
            if (req.query.location) {
                query.location = new RegExp(req.query.location, 'i');
            }
            const posts = await Post.find(query)
                .populate('author', 'fullName username email profilePicture')
                .populate('approvedBy', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            // Calculate earnings for each post
            const postsWithEarnings = await Promise.all(posts.map(async (post) => {
                await post.calculateEarnings();
                return {
                    ...post.toObject(),
                    legitimateViewsCount: post.legitimateViewsCount,
                    legitimateLikesCount: post.legitimateLikesCount,
                    botViewsCount: post.botActivity.botViews,
                    botLikesCount: post.botActivity.botLikes
                };
            }));
            const totalPosts = await Post.countDocuments(query);
            res.status(200).json({
                success: true,
                data: postsWithEarnings,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalPosts / limit),
                    totalPosts,
                    hasNextPage: page < Math.ceil(totalPosts / limit),
                    hasPrevPage: page > 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Approve post
    // @route   PUT /api/admin/posts/:id/approve
    // @access  Private (Admin/Manager)
    async approvePost(req, res, next) {
        try {
            if (!req.employee.hasPermission('approve_posts')) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }
            if (post.isApproved) {
                return res.status(400).json({
                    success: false,
                    message: 'Post is already approved'
                });
            }
            await post.approve(req.employee.id);
            res.status(200).json({
                success: true,
                message: 'Post approved successfully',
                data: post
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get approved posts for payment
    // @route   GET /api/admin/payments
    // @access  Private (Admin/Manager/Accountant)
    async getApprovedPosts(req, res, next) {
        try {
            if (!req.employee.hasPermission('view_posts')) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const posts = await Post.find({
                isActive: true,
                isApproved: true,
                isPaid: false
            })
                .populate('author', 'fullName username email profilePicture')
                .sort({ approvedAt: -1 })
                .skip(skip)
                .limit(limit);
            // Calculate earnings for each post
            const postsWithEarnings = await Promise.all(posts.map(async (post) => {
                await post.calculateEarnings();
                return {
                    ...post.toObject(),
                    legitimateViewsCount: post.legitimateViewsCount,
                    legitimateLikesCount: post.legitimateLikesCount,
                    botViewsCount: post.botActivity.botViews,
                    botLikesCount: post.botActivity.botLikes
                };
            }));
            const totalPosts = await Post.countDocuments({
                isActive: true,
                isApproved: true,
                isPaid: false
            });
            res.status(200).json({
                success: true,
                data: postsWithEarnings,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalPosts / limit),
                    totalPosts,
                    hasNextPage: page < Math.ceil(totalPosts / limit),
                    hasPrevPage: page > 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Process payment for posts
    // @route   POST /api/admin/payments/process
    // @access  Private (Admin/Accountant)
    async processPayment(req, res, next) {
        try {
            if (!req.employee.hasPermission('manage_payments')) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            const { userId, postIds, paymentMethod, bankDetails, paypalEmail, cryptoAddress, notes } = req.body;
            // Get user and posts
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            const posts = await Post.find({
                _id: { $in: postIds },
                author: userId,
                isApproved: true,
                isPaid: false
            });
            if (posts.length !== postIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Some posts are not eligible for payment'
                });
            }
            // Calculate total earnings
            let totalAmount = 0;
            const postEarnings = [];
            for (const post of posts) {
                await post.calculateEarnings();
                totalAmount += post.earnings.totalEarnings;
                postEarnings.push({
                    post: post._id,
                    earnings: post.earnings,
                    viewsCount: post.legitimateViewsCount,
                    likesCount: post.legitimateLikesCount,
                    location: post.location
                });
            }
            // Create payment record
            const paymentData = {
                user: userId,
                posts: postEarnings,
                totalAmount,
                paymentMethod,
                notes,
                periodStart: new Date(Math.min(...posts.map(p => p.createdAt.getTime()))),
                periodEnd: new Date()
            };
            // Add payment method specific details
            if (paymentMethod === 'bank_transfer' && bankDetails) {
                paymentData.bankDetails = bankDetails;
            }
            else if (paymentMethod === 'paypal' && paypalEmail) {
                paymentData.paypalEmail = paypalEmail;
            }
            else if (paymentMethod === 'crypto' && cryptoAddress) {
                paymentData.cryptoAddress = cryptoAddress;
            }
            const payment = await Payment.create(paymentData);
            // Mark posts as paid
            await Post.updateMany({ _id: { $in: postIds } }, {
                isPaid: true,
                paidAt: new Date()
            });
            // Update user's total earnings
            user.totalEarnings = (user.totalEarnings || 0) + totalAmount;
            await user.save();
            await payment.populate('user', 'fullName email username');
            res.status(201).json({
                success: true,
                message: 'Payment processed successfully',
                data: payment
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Update payment status
    // @route   PUT /api/admin/payments/:id/status
    // @access  Private (Admin/Accountant)
    async updatePaymentStatus(req, res, next) {
        try {
            if (!req.employee.hasPermission('manage_payments')) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            const { status, notes } = req.body;
            const payment = await Payment.findById(req.params.id);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }
            await payment.updateStatus(status, req.employee.id, notes);
            await payment.populate('user', 'fullName email username');
            res.status(200).json({
                success: true,
                message: 'Payment status updated successfully',
                data: payment
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get payment history
    // @route   GET /api/admin/payments/history
    // @access  Private (Admin/Manager/Accountant)
    async getPaymentHistory(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const query = {};
            // Filter by status
            if (req.query.status) {
                query.status = req.query.status;
            }
            // Filter by user
            if (req.query.userId) {
                query.user = req.query.userId;
            }
            const payments = await Payment.find(query)
                .populate('user', 'fullName email username')
                .populate('paidBy', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const totalPayments = await Payment.countDocuments(query);
            res.status(200).json({
                success: true,
                data: payments,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalPayments / limit),
                    totalPayments,
                    hasNextPage: page < Math.ceil(totalPayments / limit),
                    hasPrevPage: page > 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get admin dashboard statistics
    // @route   GET /api/admin/dashboard
    // @access  Private (Admin/Manager/Accountant)
    async getDashboardStats(req, res, next) {
        try {
            // Get basic counts
            const totalUsers = await User.countDocuments({ isActive: true });
            const totalPosts = await Post.countDocuments({ isActive: true });
            const pendingApprovals = await Post.countDocuments({
                isActive: true,
                isApproved: false
            });
            // Get payment statistics
            const paymentStats = await Payment.getPaymentStats();
            // Get bot activity statistics
            const flaggedUsers = await User.countDocuments({
                'suspiciousActivity.isFlagged': true
            });
            // Get revenue statistics
            const revenueStats = await Revenue.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: null,
                        totalCities: { $sum: 1 },
                        avgPricePerView: { $avg: '$pricePerView' },
                        avgPricePerLike: { $avg: '$pricePerLike' }
                    }
                }
            ]);
            // Get recent activity
            const recentPosts = await Post.find({ isActive: true })
                .populate('author', 'fullName username')
                .sort({ createdAt: -1 })
                .limit(5);
            const recentPayments = await Payment.find()
                .populate('user', 'fullName username')
                .sort({ createdAt: -1 })
                .limit(5);
            res.status(200).json({
                success: true,
                data: {
                    overview: {
                        totalUsers,
                        totalPosts,
                        pendingApprovals,
                        flaggedUsers
                    },
                    payments: paymentStats,
                    revenue: revenueStats[0] || {
                        totalCities: 0,
                        avgPricePerView: 0,
                        avgPricePerLike: 0
                    },
                    recentActivity: {
                        posts: recentPosts,
                        payments: recentPayments
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get bot activity report
    // @route   GET /api/admin/bot-activity
    // @access  Private (Admin/Manager)
    async getBotActivityReport(req, res, next) {
        try {
            // Get users with suspicious activity
            const suspiciousUsers = await User.find({
                $or: [
                    { 'suspiciousActivity.likeSpamCount': { $gt: 10 } },
                    { 'suspiciousActivity.viewSpamCount': { $gt: 20 } },
                    { 'suspiciousActivity.isFlagged': true }
                ]
            })
                .select('fullName username email suspiciousActivity')
                .sort({ 'suspiciousActivity.lastSuspiciousActivity': -1 })
                .limit(50);
            // Get posts with high bot activity
            const postsWithBotActivity = await Post.find({
                $or: [
                    { 'botActivity.botViews': { $gt: 5 } },
                    { 'botActivity.botLikes': { $gt: 3 } }
                ]
            })
                .populate('author', 'fullName username')
                .select('content location botActivity')
                .sort({ 'botActivity.lastBotActivity': -1 })
                .limit(20);
            res.status(200).json({
                success: true,
                data: {
                    suspiciousUsers,
                    postsWithBotActivity
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export default new AdminController();
//# sourceMappingURL=adminController.js.map