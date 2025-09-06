import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [50, 'Full name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [160, 'Bio cannot exceed 160 characters'],
    default: ''
  },
  profilePicture: {
    url: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    publicId: String
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager', 'accountant'],
    default: 'user'
  },
  followers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  // Bot detection tracking
  suspiciousActivity: {
    likeSpamCount: {
      type: Number,
      default: 0
    },
    viewSpamCount: {
      type: Number,
      default: 0
    },
    lastSuspiciousActivity: Date,
    isFlagged: {
      type: Boolean,
      default: false
    }
  },
  // Stats
  totalEarnings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual for followers count
userSchema.virtual('followersCount').get(function () {
  return this.followers.length;
});

// Virtual for following count
userSchema.virtual('followingCount').get(function () {
  return this.following.length;
});

// Virtual for posts count
userSchema.virtual('postsCount').get(function () {
  return this.posts.length;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last active timestamp
userSchema.methods.updateLastActive = function () {
  this.lastActive = new Date();
  return this.save({ validateBeforeSave: false });
};

// Check if user is following another user
userSchema.methods.isFollowing = function (userId: any) {
  return this.following.includes(userId);
};

// Follow a user
userSchema.methods.follow = async function (userId: any) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
    await this.save();

    // Add this user to the target user's followers
    await mongoose.model('User').findByIdAndUpdate(userId, {
      $addToSet: { followers: this._id }
    });
  }
};

// Unfollow a user
userSchema.methods.unfollow = async function (userId: any) {
  this.following = this.following.filter((id: any) => !id.equals(userId));
  await this.save();

  // Remove this user from the target user's followers
  await mongoose.model('User').findByIdAndUpdate(userId, {
    $pull: { followers: this._id }
  });
};

// Remove sensitive information when converting to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

export const User = mongoose.model('User', userSchema);
