import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'Comment must belong to a post']
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must have an author']
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        maxlength: [500, 'Comment cannot exceed 500 characters'],
        trim: true
    },
    // For nested replies
    parentComment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
        default: null
    },
    replies: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Comment'
        }],
    // Engagement
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
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: Date,
    reportCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes
commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ createdAt: -1 });
// Virtual for likes count
commentSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});
// Virtual for replies count
commentSchema.virtual('repliesCount').get(function () {
    return this.replies.length;
});
// Method to toggle like
commentSchema.methods.toggleLike = function (userId) {
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
    }
    return this.save();
};
// Method to check if user liked the comment
commentSchema.methods.isLikedBy = function (userId) {
    return this.likes.some(like => like.user.toString() === userId.toString());
};
// Method to add reply
commentSchema.methods.addReply = function (replyId) {
    if (!this.replies.includes(replyId)) {
        this.replies.push(replyId);
        return this.save();
    }
    return Promise.resolve(this);
};
// Method to mark as edited
commentSchema.methods.markAsEdited = function () {
    this.isEdited = true;
    this.editedAt = new Date();
    return this.save();
};
// Pre-save middleware to update post's comments array for new comments
commentSchema.pre('save', async function (next) {
    if (this.isNew && !this.parentComment) {
        // Only add top-level comments to post's comments array
        await mongoose.model('Post').findByIdAndUpdate(this.post, {
            $addToSet: { comments: this._id }
        });
    }
    if (this.isNew && this.parentComment) {
        // Add reply to parent comment's replies array
        await mongoose.model('Comment').findByIdAndUpdate(this.parentComment, {
            $addToSet: { replies: this._id }
        });
    }
    next();
});
// Pre-remove middleware to clean up references
commentSchema.pre('remove', async function (next) {
    // Remove comment from post's comments array
    if (!this.parentComment) {
        await mongoose.model('Post').findByIdAndUpdate(this.post, {
            $pull: { comments: this._id }
        });
    }
    else {
        // Remove reply from parent comment's replies array
        await mongoose.model('Comment').findByIdAndUpdate(this.parentComment, {
            $pull: { replies: this._id }
        });
    }
    // Remove all replies to this comment
    await mongoose.model('Comment').deleteMany({ parentComment: this._id });
    next();
});
export const Comment = mongoose.model('Comment', commentSchema);
//# sourceMappingURL=Comment.js.map