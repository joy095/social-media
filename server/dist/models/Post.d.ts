import mongoose from 'mongoose';
export declare const Post: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    media: {
        type: "video" | "image";
        url: string;
        publicId?: string | undefined;
        thumbnail?: string | undefined;
        duration?: number | undefined;
        size?: number | undefined;
    }[];
    author: mongoose.Types.ObjectId;
    content: string;
    location: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    comments: mongoose.Types.ObjectId[];
    views: {
        viewedAt: Date;
        isBot: boolean;
        user?: mongoose.Types.ObjectId | undefined;
        duration?: number | undefined;
    }[];
    isApproved: boolean;
    isPaid: boolean;
    visibility: "followers" | "public" | "private";
    reportCount: number;
    approvedAt?: Date | undefined;
    paidAt?: Date | undefined;
    approvedBy?: mongoose.Types.ObjectId | undefined;
    earnings?: {
        totalEarnings: number;
        viewEarnings: number;
        likeEarnings: number;
    } | undefined;
    botActivity?: {
        botViews: number;
        botLikes: number;
        lastBotActivity?: Date | undefined;
    } | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    media: {
        type: "video" | "image";
        url: string;
        publicId?: string | undefined;
        thumbnail?: string | undefined;
        duration?: number | undefined;
        size?: number | undefined;
    }[];
    author: mongoose.Types.ObjectId;
    content: string;
    location: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    comments: mongoose.Types.ObjectId[];
    views: {
        viewedAt: Date;
        isBot: boolean;
        user?: mongoose.Types.ObjectId | undefined;
        duration?: number | undefined;
    }[];
    isApproved: boolean;
    isPaid: boolean;
    visibility: "followers" | "public" | "private";
    reportCount: number;
    approvedAt?: Date | undefined;
    paidAt?: Date | undefined;
    approvedBy?: mongoose.Types.ObjectId | undefined;
    earnings?: {
        totalEarnings: number;
        viewEarnings: number;
        likeEarnings: number;
    } | undefined;
    botActivity?: {
        botViews: number;
        botLikes: number;
        lastBotActivity?: Date | undefined;
    } | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    media: {
        type: "video" | "image";
        url: string;
        publicId?: string | undefined;
        thumbnail?: string | undefined;
        duration?: number | undefined;
        size?: number | undefined;
    }[];
    author: mongoose.Types.ObjectId;
    content: string;
    location: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    comments: mongoose.Types.ObjectId[];
    views: {
        viewedAt: Date;
        isBot: boolean;
        user?: mongoose.Types.ObjectId | undefined;
        duration?: number | undefined;
    }[];
    isApproved: boolean;
    isPaid: boolean;
    visibility: "followers" | "public" | "private";
    reportCount: number;
    approvedAt?: Date | undefined;
    paidAt?: Date | undefined;
    approvedBy?: mongoose.Types.ObjectId | undefined;
    earnings?: {
        totalEarnings: number;
        viewEarnings: number;
        likeEarnings: number;
    } | undefined;
    botActivity?: {
        botViews: number;
        botLikes: number;
        lastBotActivity?: Date | undefined;
    } | undefined;
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
    media: {
        type: "video" | "image";
        url: string;
        publicId?: string | undefined;
        thumbnail?: string | undefined;
        duration?: number | undefined;
        size?: number | undefined;
    }[];
    author: mongoose.Types.ObjectId;
    content: string;
    location: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    comments: mongoose.Types.ObjectId[];
    views: {
        viewedAt: Date;
        isBot: boolean;
        user?: mongoose.Types.ObjectId | undefined;
        duration?: number | undefined;
    }[];
    isApproved: boolean;
    isPaid: boolean;
    visibility: "followers" | "public" | "private";
    reportCount: number;
    approvedAt?: Date | undefined;
    paidAt?: Date | undefined;
    approvedBy?: mongoose.Types.ObjectId | undefined;
    earnings?: {
        totalEarnings: number;
        viewEarnings: number;
        likeEarnings: number;
    } | undefined;
    botActivity?: {
        botViews: number;
        botLikes: number;
        lastBotActivity?: Date | undefined;
    } | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    media: {
        type: "video" | "image";
        url: string;
        publicId?: string | undefined;
        thumbnail?: string | undefined;
        duration?: number | undefined;
        size?: number | undefined;
    }[];
    author: mongoose.Types.ObjectId;
    content: string;
    location: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    comments: mongoose.Types.ObjectId[];
    views: {
        viewedAt: Date;
        isBot: boolean;
        user?: mongoose.Types.ObjectId | undefined;
        duration?: number | undefined;
    }[];
    isApproved: boolean;
    isPaid: boolean;
    visibility: "followers" | "public" | "private";
    reportCount: number;
    approvedAt?: Date | undefined;
    paidAt?: Date | undefined;
    approvedBy?: mongoose.Types.ObjectId | undefined;
    earnings?: {
        totalEarnings: number;
        viewEarnings: number;
        likeEarnings: number;
    } | undefined;
    botActivity?: {
        botViews: number;
        botLikes: number;
        lastBotActivity?: Date | undefined;
    } | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    isActive: boolean;
    media: {
        type: "video" | "image";
        url: string;
        publicId?: string | undefined;
        thumbnail?: string | undefined;
        duration?: number | undefined;
        size?: number | undefined;
    }[];
    author: mongoose.Types.ObjectId;
    content: string;
    location: string;
    likes: {
        createdAt: Date;
        user?: mongoose.Types.ObjectId | undefined;
    }[];
    comments: mongoose.Types.ObjectId[];
    views: {
        viewedAt: Date;
        isBot: boolean;
        user?: mongoose.Types.ObjectId | undefined;
        duration?: number | undefined;
    }[];
    isApproved: boolean;
    isPaid: boolean;
    visibility: "followers" | "public" | "private";
    reportCount: number;
    approvedAt?: Date | undefined;
    paidAt?: Date | undefined;
    approvedBy?: mongoose.Types.ObjectId | undefined;
    earnings?: {
        totalEarnings: number;
        viewEarnings: number;
        likeEarnings: number;
    } | undefined;
    botActivity?: {
        botViews: number;
        botLikes: number;
        lastBotActivity?: Date | undefined;
    } | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=Post.d.ts.map