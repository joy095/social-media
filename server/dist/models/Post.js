import mongoose from 'mongoose';
const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Post must have an author']
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
        maxlength: [280, 'Post content cannot exceed 280 characters'],
        trim: true
    },
    media: [{
            type: {
                type: String,
                enum: ['image', 'video'],
                required: true
            },
            url: {
                type: String,
                required: true
            },
            publicId: String,
            thumbnail: String, // For videos
            duration: Number, // For videos in seconds
            size: Number // File size in bytes
        }],
    location: {
        type: String,
        required: [true, 'Post location is required'],
        trim: true
    },
    likes: [{
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
    comments: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Comment'
        }],
    views: [{
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            viewedAt: {
                type: Date,
                default: Date.now
            },
            duration: Number, // How long the user viewed the post in seconds
            isBot: {
                type: Boolean,
                default: false
            }
        }],
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    // Revenue calculations
    earnings: {
        viewEarnings: {
            type: Number,
            default: 0
        },
        likeEarnings: {
            type: Number,
            default: 0
        },
        totalEarnings: {
            type: Number,
            default: 0
        }
    },
    // Bot detection
    botActivity: {
        botViews: {
            type: Number,
            default: 0
        },
        botLikes: {
            type: Number,
            default: 0
        },
        lastBotActivity: Date
    },
    // Privacy settings
    visibility: {
        type: String,
        enum: ['public', 'followers', 'private'],
        default: 'public'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    reportCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes for better performance
postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ location: 1 });
postSchema.index({ isApproved: 1 });
postSchema.index({ isPaid: 1 });
postSchema.index({ isActive: 1 });
postSchema.index({ visibility: 1 });
// Virtual for likes count
postSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});
// Virtual for comments count
postSchema.virtual('commentsCount').get(function () {
    return this.comments.length;
});
// Virtual for views count
postSchema.virtual('viewsCount').get(function () {
    return this.views.length;
});
// Virtual for legitimate views count (excluding bot views)
postSchema.virtual('legitimateViewsCount').get(function () {
    return this.views.filter(view => !view.isBot).length;
});
// Virtual for legitimate likes count (excluding bot likes)
postSchema.virtual('legitimateLikesCount').get(function () {
    // This would need additional logic to determine bot likes
    return this.likes.length - this.botActivity.botLikes;
});
// Method to add a view
postSchema.methods.addView = function (userId, duration = 0, isBot = false) {
    // Check if user already viewed this post recently (within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingView = this.views.find(view => view.user.toString() === userId.toString() &&
        view.viewedAt > oneHourAgo);
    if (!existingView) {
        this.views.push({
            user: userId,
            viewedAt: new Date(),
            duration,
            isBot
        });
        if (isBot) {
            this.botActivity.botViews += 1;
            this.botActivity.lastBotActivity = new Date();
        }
        return this.save();
    }
    return Promise.resolve(this);
};
// Method to add/remove like
postSchema.methods.toggleLike = function (userId, isBot = false) {
    const existingLikeIndex = this.likes.findIndex(like => like.user.toString() === userId.toString());
    if (existingLikeIndex > -1) {
        // Remove like
        this.likes.splice(existingLikeIndex, 1);
    }
    else {
        // Add like
        this.likes.push({
            user: userId,
            createdAt: new Date()
        });
        if (isBot) {
            this.botActivity.botLikes += 1;
            this.botActivity.lastBotActivity = new Date();
        }
    }
    return this.save();
};
// Method to check if user liked the post
postSchema.methods.isLikedBy = function (userId) {
    return this.likes.some(like => like.user.toString() === userId.toString());
};
// Method to calculate earnings based on city pricing
postSchema.methods.calculateEarnings = async function () {
    const Revenue = mongoose.model('Revenue');
    const pricing = await Revenue.findOne({ city: this.location });
    if (pricing) {
        const legitimateViews = this.legitimateViewsCount;
        const legitimateLikes = this.legitimateLikesCount;
        this.earnings.viewEarnings = legitimateViews * pricing.pricePerView;
        this.earnings.likeEarnings = legitimateLikes * pricing.pricePerLike;
        this.earnings.totalEarnings = this.earnings.viewEarnings + this.earnings.likeEarnings;
        await this.save();
    }
    return this.earnings;
};
// Method to approve post
postSchema.methods.approve = function (adminId) {
    this.isApproved = true;
    this.approvedBy = adminId;
    this.approvedAt = new Date();
    return this.save();
};
// Method to mark as paid
postSchema.methods.markAsPaid = function () {
    this.isPaid = true;
    this.paidAt = new Date();
    return this.save();
};
// Pre-save middleware to update author's posts array
postSchema.pre('save', async function (next) {
    if (this.isNew) {
        await mongoose.model('User').findByIdAndUpdate(this.author, {
            $addToSet: { posts: this._id }
        });
    }
    next();
});
// Pre-remove middleware to clean up references
postSchema.pre('remove', async function (next) {
    // Remove post from author's posts array
    await mongoose.model('User').findByIdAndUpdate(this.author, {
        $pull: { posts: this._id }
    });
    // Remove all comments associated with this post
    await mongoose.model('Comment').deleteMany({ post: this._id });
    next();
});
export const Post = mongoose.model('Post', postSchema);
//# sourceMappingURL=Post.js.map