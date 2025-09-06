import express, { NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { User } from '../models/User';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

// @desc    Get all users / Search users
// @route   GET /api/users
// @access  Public
router.get('/', [
  optionalAuth,
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    let filter = { isActive: true };

    // Add search functionality
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('fullName username profilePicture bio followersCount followingCount postsCount')
      .sort({ followersCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + users.length < total
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'fullName username profilePicture')
      .populate('following', 'fullName username profilePicture');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add follow status if authenticated
    if (req.user) {
      user.isFollowedByCurrentUser = req.user.isFollowing(user._id);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user stats
// @route   GET /api/users/:id/stats
// @access  Public
router.get('/:id/stats', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('followersCount followingCount postsCount totalEarnings');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        followers: user.followersCount,
        following: user.followingCount,
        posts: user.postsCount,
        earnings: user.totalEarnings || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
