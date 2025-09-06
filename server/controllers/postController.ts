import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Revenue } from "../models/Revenue";
import { AuthRequest } from "../middleware/auth";
import {
  deleteFromR2,
  uploadToR2,
  uploadVideoToR2,
} from "../utils/r2";
import { processVideo } from "../utils/videoProcessor";
import { getRandomCity } from "../utils/cities";
import fs from "fs";

function safeUnlink(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted temp file: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err);
  }
}

class PostController {
  // @desc    Create new post
  // @route   POST /api/posts
  // @access  Private
  async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { content, visibility } = req.body;
      const mediaFiles: Array<{
        type: "image" | "video";
        url: string;
        publicId: string;
        size: number;
        duration?: number;
        thumbnail?: string;
      }> = [];

      if (req.files && Array.isArray(req.files)) {
        const uploadPromises = req.files.map(async (file: any) => {
          try {
            let mediaItem: any = {
              type: file.mimetype.startsWith("image/") ? "image" : "video",
              size: file.size,
            };

            if (mediaItem.type === "image") {
              const uploadResult = await uploadToR2(file.path);
              mediaItem.url = uploadResult.secure_url;
              mediaItem.publicId = uploadResult.public_id;
            } else if (mediaItem.type === "video") {
              const processedVideo = await processVideo(file.path);

              try {
                const uploadResult = await uploadVideoToR2(
                  processedVideo.videoPath
                );
                mediaItem.url = uploadResult.secure_url;
                mediaItem.publicId = uploadResult.public_id;
                mediaItem.duration = processedVideo.duration;

                if (processedVideo.thumbnailPath) {
                  const thumbnailResult = await uploadToR2(
                    processedVideo.thumbnailPath
                  );
                  mediaItem.thumbnail = thumbnailResult.secure_url;
                  safeUnlink(processedVideo.thumbnailPath);
                }
              } catch (uploadError: any) {
                console.error("Video upload error:", uploadError.message);
                throw new Error(`Failed to upload video: ${uploadError.message}`);
              } finally {
                safeUnlink(processedVideo.videoPath);
              }
            }

            safeUnlink(file.path);
            return mediaItem;
          } catch (uploadError) {
            safeUnlink(file.path);
            throw uploadError;
          }
        });

        try {
          const results = await Promise.all(uploadPromises);
          mediaFiles.push(...results);
        } catch (uploadError) {
          mediaFiles.forEach((file) => {
            try {
              deleteFromR2(file.publicId);
            } catch (cleanupError) {
              console.error(
                `Failed to cleanup R2 file ${file.publicId}:`,
                cleanupError
              );
            }
          });
          throw uploadError;
        }
      }

      const location = getRandomCity();

      const post = await Post.create({
        author: req.user.id,
        content,
        media: mediaFiles,
        location,
        visibility: visibility || "public",
      });

      await post.populate("author", "fullName username profilePicture");

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (error: any) {
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file: any) => safeUnlink(file.path));
      }
      console.error("Create post error:", error.message);
      res.status(400).json({
        success: false,
        message: `Failed to create post: ${error.message}`,
      });
    }
  }

  // @desc    Get all posts (feed)
  // @route   GET /api/posts
  // @access  Private
  async getPosts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Use aggregation pipeline for better performance
      const user = await User.findById(req.user.id).select("following");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const pipeline = [
        {
          $match: {
            isActive: true,
            $or: [
              { visibility: "public" },
              {
                visibility: "followers",
                author: { $in: user.following },
              },
              { author: req.user.id },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
        {
          $project: {
            "author.password": 0,
            "author.email": 0,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];

      const posts = await Post.aggregate(pipeline);

      // Add user interaction flags
      const postsWithInteraction = posts.map((post) => ({
        ...post,
        isLikedByUser:
          post.likes?.some(
            (like: any) => like.user?.toString() === req.user.id.toString()
          ) || false,
        userHasViewed:
          post.views?.some(
            (view: any) => view.user?.toString() === req.user.id.toString()
          ) || false,
      }));

      const totalPosts = await Post.countDocuments({
        isActive: true,
        $or: [
          { visibility: "public" },
          {
            visibility: "followers",
            author: { $in: user.following },
          },
          { author: req.user.id },
        ],
      });

      res.status(200).json({
        success: true,
        data: postsWithInteraction,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          hasNextPage: page < Math.ceil(totalPosts / limit),
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single post
  // @route   GET /api/posts/:id
  // @access  Private
  async getPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await Post.findById(req.params.id)
        .populate("author", "fullName username profilePicture role")
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "fullName username profilePicture",
          },
          sort: { createdAt: -1 },
        });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if user can view this post
      const canView = await this.canUserViewPost(post, req.user.id);
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Record view if not already viewed recently
      await post.addView(req.user.id, 0, false);

      const postObject = post.toObject();
      res.status(200).json({
        success: true,
        data: {
          ...postObject,
          isLikedByUser: post.isLikedBy(req.user.id),
          userHasViewed: true,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update post
  // @route   PUT /api/posts/:id
  // @access  Private
  async updatePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if user is the author
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const { content, visibility } = req.body;
      const updateData: any = {};

      if (content !== undefined) updateData.content = content;
      if (visibility !== undefined) updateData.visibility = visibility;

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate("author", "fullName username profilePicture role");

      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete post
  // @route   DELETE /api/posts/:id
  // @access  Private
  async deletePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if user is the author or admin
      const user = await User.findById(req.user.id);
      if (post.author.toString() !== req.user.id && user?.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Soft delete
      post.isActive = false;
      await post.save();

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get user's posts
  // @route   GET /api/posts/user/:userId
  // @access  Private
  async getUserPosts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if user can view profile
      const canView = await this.canViewUserProfile(targetUser, req.user.id);
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: "This account is private",
        });
      }

      const query: any = {
        author: userId,
        isActive: true,
      };

      // If viewing own profile or public profile, show all posts
      // If private profile and following, show followers-only and public posts
      if (targetUser.isPrivate && userId !== req.user.id) {
        query.visibility = { $in: ["public", "followers"] };
      }

      const posts = await Post.find(query)
        .populate("author", "fullName username profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPosts = await Post.countDocuments(query);

      res.status(200).json({
        success: true,
        data: posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          hasNextPage: page < Math.ceil(totalPosts / limit),
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Record post view
  // @route   POST /api/posts/:id/view
  // @access  Private
  async recordView(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { duration, screenPercentage } = req.body;
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Only record view if at least 70% of post was visible
      if (screenPercentage >= 70) {
        // Detect potential bot behavior
        const user = await User.findById(req.user.id);
        const isBot = this.detectBotBehavior(user, duration, screenPercentage);

        await post.addView(req.user.id, duration, isBot);

        if (isBot) {
          // Update user's bot activity tracking
          user!.suspiciousActivity.viewSpamCount += 1;
          user!.suspiciousActivity.lastSuspiciousActivity = new Date();
          await user!.save();
        }
      }

      res.status(200).json({
        success: true,
        message: "View recorded",
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to check if user can view post
  private async canUserViewPost(post: any, userId: string): Promise<boolean> {
    if (post.visibility === "public") return true;
    if (post.author._id.toString() === userId) return true;

    if (post.visibility === "followers") {
      const user = await User.findById(userId);
      return user?.following.includes(post.author._id) || false;
    }

    return false;
  }

  // Helper method to check if user can view profile
  private async canViewUserProfile(
    targetUser: any,
    currentUserId: string
  ): Promise<boolean> {
    if (!targetUser.isPrivate) return true;
    if (targetUser._id.toString() === currentUserId) return true;

    return targetUser.followers.includes(currentUserId);
  }

  // Helper method to detect bot behavior
  private detectBotBehavior(
    user: any,
    viewDuration: number,
    screenPercentage: number
  ): boolean {
    // Enhanced bot detection logic
    const recentViews = user.suspiciousActivity?.viewSpamCount || 0;
    const lastActivity = user.suspiciousActivity?.lastSuspiciousActivity;
    const now = new Date();

    // Rapid consecutive views
    if (
      lastActivity &&
      now.getTime() - new Date(lastActivity).getTime() < 60000 &&
      recentViews > 5
    ) {
      return true;
    }

    // Suspiciously short view duration
    if (viewDuration < 0.5) {
      return true;
    }

    // Suspicious screen percentage
    if (screenPercentage > 100 || screenPercentage < 0) {
      return true;
    }

    // Very short views that claim high engagement
    if (viewDuration < 1 && screenPercentage > 90) {
      return true;
    }

    return false;
  }
}

export default new PostController();
