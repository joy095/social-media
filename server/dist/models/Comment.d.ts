import mongoose from 'mongoose';
export declare const Comment: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    reportCount: number;
    parentComment: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
    isEdited: boolean;
    editedAt?: Date | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    reportCount: number;
    parentComment: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
    isEdited: boolean;
    editedAt?: Date | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    reportCount: number;
    parentComment: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
    isEdited: boolean;
    editedAt?: Date | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    reportCount: number;
    parentComment: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
    isEdited: boolean;
    editedAt?: Date | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    reportCount: number;
    parentComment: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
    isEdited: boolean;
    editedAt?: Date | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    content: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    reportCount: number;
    parentComment: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
    isEdited: boolean;
    editedAt?: Date | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=Comment.d.ts.map