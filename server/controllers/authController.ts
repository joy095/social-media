import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { generateToken, sendTokenResponse } from "../utils/generateToken";
import { uploadToLocal } from "../utils/localStorage";
import { AuthRequest } from "../middleware/auth";
import fs from "fs";
import path from "path";
import logger from "utils/logger.js";

class AuthController {
  // @desc    Register user
  // @route   POST /api/auth/register
  // @access  Public
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { fullName, email, username, password, bio, isPrivate } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        const field = existingUser.email === email ? "email" : "username";
        return res.status(400).json({
          success: false,
          message: `User with this ${field} already exists`,
        });
      }

      // Create user
      const user = await User.create({
        fullName,
        email,
        username,
        password,
        bio: bio || "",
        isPrivate: isPrivate || false,
      });

      sendTokenResponse(user, 201, res, "User registered successfully");
    } catch (error) {
      next(error);
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { loginField, password } = req.body;

      // Find user by email or username
      const user = await User.findOne({
        $or: [{ email: loginField.toLowerCase() }, { username: loginField }],
      }).select("+password");

      // Check if user exists and password is correct
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Update last active timestamp
      await user.updateLastActive();

      sendTokenResponse(user, 200, res, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get current logged in user
  // @route   GET /api/auth/me
  // @access  Private
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user.id)
        .populate("followers", "fullName username profilePicture")
        .populate("following", "fullName username profilePicture");

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update user profile
  // @route   PUT /api/auth/profile
  // @access  Private
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { fullName, bio, isPrivate } = req.body;
      const updateData: any = {};

      // Update basic fields if provided
      if (fullName) updateData.fullName = fullName;
      if (bio !== undefined) updateData.bio = bio;
      if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

      // Handle profile picture upload
      if (req.file) {
        try {
          // For profile pictures, the file is already in the correct location from multer
          const relativePath = path.relative(process.cwd(), req.file.path);
          updateData.profilePicture = {
            url: `/uploads/profiles/${path.basename(req.file.path)}`,
            publicId: relativePath,
          };

          // No need to clean up file as it's now in permanent location
        } catch (uploadError) {
          // Clean up file if there was an error
          if (req.file && req.file.path) {
            try {
              fs.unlinkSync(req.file.path);
            } catch (fsError) {
              console.error("Error deleting file:", fsError);
            }
          }
          throw uploadError;
        }
      }

      const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("followers", "fullName username profilePicture")
        .populate("following", "fullName username profilePicture");

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Change password
  // @route   PUT /api/auth/change-password
  // @access  Private
  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check current password
      if (!(await user.comparePassword(currentPassword))) {
        // Log error
        logger.error("Current password is incorrect");

        return res.status(400).json({
          success: false,
          message: "Invalid credential",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Logout user
  // @route   POST /api/auth/logout
  // @access  Private
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just send a success response
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete account
  // @route   DELETE /api/auth/delete-account
  // @access  Private
  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;

      // Get user with password
      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify password
      if (!(await user.comparePassword(password))) {
        logger.error("Current Password is incorrect");

        return res.status(400).json({
          success: false,
          message: "Invalid credential",
        });
      }

      // Soft delete - deactivate account
      user.isActive = false;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Account deactivated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get user statistics
  // @route   GET /api/auth/stats
  // @access  Private
  async getUserStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user.id)
        .populate("posts")
        .populate("followers")
        .populate("following");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const stats = {
        postsCount: user.posts.length,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        totalEarnings: user.totalEarnings || 0,
        joinedDate: user.createdAt,
        lastActive: user.lastActive,
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
