import { validationResult } from 'express-validator';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { User } from '../models/User';
class SocialController {
    // @desc    Toggle like on post
    // @route   POST /api/social/posts/:id/like
    // @access  Private
    async togglePostLike(req, res, next) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }
            // Check if user can interact with this post
            const canInteract = await this.canUserInteractWithPost(post, req.user.id);
            if (!canInteract) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
            // Detect potential bot behavior
            const user = await User.findById(req.user.id);
            const isBot = this.detectBotBehavior(user, 'like');
            const wasLiked = post.isLikedBy(req.user.id);
            await post.toggleLike(req.user.id, isBot);
            if (isBot) {
                // Update user's bot activity tracking
                user.suspiciousActivity.likeSpamCount += 1;
                user.suspiciousActivity.lastSuspiciousActivity = new Date();
                if (user.suspiciousActivity.likeSpamCount > 50) {
                    user.suspiciousActivity.isFlagged = true;
                }
                await user.save();
            }
            // Emit real-time update via socket
            const io = req.app.get('socketio');
            io.emit('post_liked', {
                postId: post._id,
                userId: req.user.id,
                likesCount: post.likesCount,
                isLiked: !wasLiked
            });
            res.status(200).json({
                success: true,
                message: wasLiked ? 'Post unliked' : 'Post liked',
                data: {
                    isLiked: !wasLiked,
                    likesCount: post.likesCount
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get post likes
    // @route   GET /api/social/posts/:id/likes
    // @access  Private
    async getPostLikes(req, res, next) {
        try {
            const post = await Post.findById(req.params.id)
                .populate('likes.user', 'fullName username profilePicture')
                .select('likes');
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }
            res.status(200).json({
                success: true,
                data: post.likes
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Add comment to post
    // @route   POST /api/social/posts/:id/comments
    // @access  Private
    async addComment(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }
            const canInteract = await this.canUserInteractWithPost(post, req.user.id);
            if (!canInteract) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
            const { content, parentComment } = req.body;
            const comment = await Comment.create({
                post: req.params.id,
                author: req.user.id,
                content,
                parentComment: parentComment || null
            });
            await comment.populate('author', 'fullName username profilePicture');
            // Emit real-time update via socket
            const io = req.app.get('socketio');
            io.emit('comment_added', {
                postId: post._id,
                comment: comment
            });
            res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                data: comment
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get post comments
    // @route   GET /api/social/posts/:id/comments
    // @access  Private
    async getPostComments(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const comments = await Comment.find({
                post: req.params.id,
                parentComment: null, // Get only top-level comments
                isActive: true
            })
                .populate('author', 'fullName username profilePicture')
                .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'fullName username profilePicture'
                },
                match: { isActive: true },
                options: { sort: { createdAt: 1 }, limit: 3 }
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const totalComments = await Comment.countDocuments({
                post: req.params.id,
                parentComment: null,
                isActive: true
            });
            res.status(200).json({
                success: true,
                data: comments,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalComments / limit),
                    totalComments,
                    hasNextPage: page < Math.ceil(totalComments / limit),
                    hasPrevPage: page > 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get comment replies
    // @route   GET /api/social/comments/:id/replies
    // @access  Private
    async getCommentReplies(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const replies = await Comment.find({
                parentComment: req.params.id,
                isActive: true
            })
                .populate('author', 'fullName username profilePicture')
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(limit);
            const totalReplies = await Comment.countDocuments({
                parentComment: req.params.id,
                isActive: true
            });
            res.status(200).json({
                success: true,
                data: replies,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalReplies / limit),
                    totalReplies,
                    hasNextPage: page < Math.ceil(totalReplies / limit),
                    hasPrevPage: page > 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Update comment
    // @route   PUT /api/social/comments/:id
    // @access  Private
    async updateComment(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }
            if (comment.author.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
            const { content } = req.body;
            comment.content = content;
            await comment.markAsEdited();
            await comment.populate('author', 'fullName username profilePicture');
            res.status(200).json({
                success: true,
                message: 'Comment updated successfully',
                data: comment
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Delete comment
    // @route   DELETE /api/social/comments/:id
    // @access  Private
    async deleteComment(req, res, next) {
        try {
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }
            // Check if user is the author or admin
            const user = await User.findById(req.user.id);
            if (comment.author.toString() !== req.user.id && user?.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
            // Soft delete
            comment.isActive = false;
            await comment.save();
            res.status(200).json({
                success: true,
                message: 'Comment deleted successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Toggle like on comment
    // @route   POST /api/social/comments/:id/like
    // @access  Private
    async toggleCommentLike(req, res, next) {
        try {
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }
            const wasLiked = comment.isLikedBy(req.user.id);
            await comment.toggleLike(req.user.id);
            res.status(200).json({
                success: true,
                message: wasLiked ? 'Comment unliked' : 'Comment liked',
                data: {
                    isLiked: !wasLiked,
                    likesCount: comment.likesCount
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Follow user
    // @route   POST /api/social/users/:id/follow
    // @access  Private
    async followUser(req, res, next) {
        try {
            const targetUserId = req.params.id;
            if (targetUserId === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'You cannot follow yourself'
                });
            }
            const targetUser = await User.findById(targetUserId);
            if (!targetUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            const currentUser = await User.findById(req.user.id);
            if (currentUser.isFollowing(targetUserId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Already following this user'
                });
            }
            await currentUser.follow(targetUserId);
            // Emit real-time notification
            const io = req.app.get('socketio');
            io.to(targetUserId).emit('new_follower', {
                follower: {
                    id: req.user.id,
                    fullName: currentUser.fullName,
                    username: currentUser.username,
                    profilePicture: currentUser.profilePicture
                }
            });
            res.status(200).json({
                success: true,
                message: 'Successfully followed user',
                data: {
                    isFollowing: true,
                    followersCount: targetUser.followersCount + 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Unfollow user
    // @route   DELETE /api/social/users/:id/follow
    // @access  Private
    async unfollowUser(req, res, next) {
        try {
            const targetUserId = req.params.id;
            if (targetUserId === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'You cannot unfollow yourself'
                });
            }
            const targetUser = await User.findById(targetUserId);
            if (!targetUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            const currentUser = await User.findById(req.user.id);
            if (!currentUser.isFollowing(targetUserId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Not following this user'
                });
            }
            await currentUser.unfollow(targetUserId);
            res.status(200).json({
                success: true,
                message: 'Successfully unfollowed user',
                data: {
                    isFollowing: false,
                    followersCount: Math.max(0, targetUser.followersCount - 1)
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get user followers
    // @route   GET /api/social/users/:id/followers
    // @access  Private
    async getUserFollowers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const user = await User.findById(req.params.id)
                .populate({
                path: 'followers',
                select: 'fullName username profilePicture',
                options: { skip, limit }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            // Check if profile is private and current user is not following
            if (user.isPrivate && req.params.id !== req.user.id) {
                const currentUser = await User.findById(req.user.id);
                if (!user.followers.includes(req.user.id)) {
                    return res.status(403).json({
                        success: false,
                        message: 'This account is private'
                    });
                }
            }
            const totalFollowers = user.followersCount;
            res.status(200).json({
                success: true,
                data: user.followers,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalFollowers / limit),
                    totalFollowers,
                    hasNextPage: page < Math.ceil(totalFollowers / limit),
                    hasPrevPage: page > 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get user following
    // @route   GET /api/social/users/:id/following
    // @access  Private
    async getUserFollowing(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const user = await User.findById(req.params.id)
                .populate({
                path: 'following',
                select: 'fullName username profilePicture',
                options: { skip, limit }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            // Check if profile is private and current user is not following
            if (user.isPrivate && req.params.id !== req.user.id) {
                if (!user.followers.includes(req.user.id)) {
                    return res.status(403).json({
                        success: false,
                        message: 'This account is private'
                    });
                }
            }
            const totalFollowing = user.followingCount;
            res.status(200).json({
                success: true,
                data: user.following,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalFollowing / limit),
                    totalFollowing,
                    hasNextPage: page < Math.ceil(totalFollowing / limit),
                    hasPrevPage: page > 1
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // @desc    Get follow suggestions
    // @route   GET /api/social/suggestions
    // @access  Private
    async getFollowSuggestions(req, res, next) {
        try {
            const currentUser = await User.findById(req.user.id);
            if (!currentUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            // Get users followed by people you follow (mutual connections)
            const suggestions = await User.aggregate([
                // Match users that current user is following
                { $match: { _id: { $in: currentUser.following } } },
                // Unwind their following list
                { $unwind: '$following' },
                // Group to get users followed by multiple people you follow
                {
                    $group: {
                        _id: '$following',
                        mutualConnections: { $sum: 1 },
                        mutualFollowers: { $push: '$_id' }
                    }
                },
                // Exclude users already followed and self
                {
                    $match: {
                        _id: {
                            $nin: [
                                ...currentUser.following,
                                currentUser._id
                            ]
                        }
                    }
                },
                // Lookup user details
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                // Only suggest active users
                { $match: { 'user.isActive': true } },
                // Sort by mutual connections
                { $sort: { mutualConnections: -1 } },
                // Limit results
                { $limit: 10 },
                // Project final shape
                {
                    $project: {
                        _id: '$user._id',
                        fullName: '$user.fullName',
                        username: '$user.username',
                        profilePicture: '$user.profilePicture',
                        followersCount: { $size: '$user.followers' },
                        mutualConnections: 1
                    }
                }
            ]);
            res.status(200).json({
                success: true,
                data: suggestions
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Helper method to check if user can interact with post
    async canUserInteractWithPost(post, userId) {
        if (post.visibility === 'public')
            return true;
        if (post.author.toString() === userId)
            return true;
        if (post.visibility === 'followers') {
            const user = await User.findById(userId);
            return user?.following.includes(post.author) || false;
        }
        return false;
    }
    // Helper method to detect bot behavior for likes
    detectBotBehavior(user, action) {
        const now = new Date();
        const lastActivity = user.suspiciousActivity.lastSuspiciousActivity;
        if (action === 'like') {
            const recentLikes = user.suspiciousActivity.likeSpamCount;
            // If user has made many likes in short time
            if (lastActivity && (now.getTime() - lastActivity.getTime()) < 60000 && recentLikes > 20) {
                return true;
            }
        }
        return false;
    }
}
export default new SocialController();
//# sourceMappingURL=socialController.js.map