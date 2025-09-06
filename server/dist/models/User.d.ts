import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    username: string;
    password: string;
    bio: string;
    isPrivate: boolean;
    role: "user" | "admin" | "manager" | "accountant";
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    isActive: boolean;
    lastActive: Date;
    emailVerified: boolean;
    totalEarnings: number;
    profilePicture?: {
        url: string;
        publicId?: string | undefined;
    } | undefined;
    suspiciousActivity?: {
        likeSpamCount: number;
        viewSpamCount: number;
        isFlagged: boolean;
        lastSuspiciousActivity?: Date | undefined;
    } | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    username: string;
    password: string;
    bio: string;
    isPrivate: boolean;
    role: "user" | "admin" | "manager" | "accountant";
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    isActive: boolean;
    lastActive: Date;
    emailVerified: boolean;
    totalEarnings: number;
    profilePicture?: {
        url: string;
        publicId?: string | undefined;
    } | undefined;
    suspiciousActivity?: {
        likeSpamCount: number;
        viewSpamCount: number;
        isFlagged: boolean;
        lastSuspiciousActivity?: Date | undefined;
    } | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    username: string;
    password: string;
    bio: string;
    isPrivate: boolean;
    role: "user" | "admin" | "manager" | "accountant";
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    isActive: boolean;
    lastActive: Date;
    emailVerified: boolean;
    totalEarnings: number;
    profilePicture?: {
        url: string;
        publicId?: string | undefined;
    } | undefined;
    suspiciousActivity?: {
        likeSpamCount: number;
        viewSpamCount: number;
        isFlagged: boolean;
        lastSuspiciousActivity?: Date | undefined;
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
    fullName: string;
    email: string;
    username: string;
    password: string;
    bio: string;
    isPrivate: boolean;
    role: "user" | "admin" | "manager" | "accountant";
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    isActive: boolean;
    lastActive: Date;
    emailVerified: boolean;
    totalEarnings: number;
    profilePicture?: {
        url: string;
        publicId?: string | undefined;
    } | undefined;
    suspiciousActivity?: {
        likeSpamCount: number;
        viewSpamCount: number;
        isFlagged: boolean;
        lastSuspiciousActivity?: Date | undefined;
    } | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    username: string;
    password: string;
    bio: string;
    isPrivate: boolean;
    role: "user" | "admin" | "manager" | "accountant";
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    isActive: boolean;
    lastActive: Date;
    emailVerified: boolean;
    totalEarnings: number;
    profilePicture?: {
        url: string;
        publicId?: string | undefined;
    } | undefined;
    suspiciousActivity?: {
        likeSpamCount: number;
        viewSpamCount: number;
        isFlagged: boolean;
        lastSuspiciousActivity?: Date | undefined;
    } | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    username: string;
    password: string;
    bio: string;
    isPrivate: boolean;
    role: "user" | "admin" | "manager" | "accountant";
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    isActive: boolean;
    lastActive: Date;
    emailVerified: boolean;
    totalEarnings: number;
    profilePicture?: {
        url: string;
        publicId?: string | undefined;
    } | undefined;
    suspiciousActivity?: {
        likeSpamCount: number;
        viewSpamCount: number;
        isFlagged: boolean;
        lastSuspiciousActivity?: Date | undefined;
    } | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=User.d.ts.map