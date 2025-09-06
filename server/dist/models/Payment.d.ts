import mongoose from 'mongoose';
export declare const Payment: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    posts: {
        post: mongoose.Types.ObjectId;
        likesCount: number;
        viewsCount: number;
        location?: string | undefined;
        earnings?: {
            totalEarnings: number;
            viewEarnings: number;
            likeEarnings: number;
        } | undefined;
    }[];
    totalAmount: number;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    paymentMethod: "bank_transfer" | "paypal" | "crypto" | "check";
    statusHistory: {
        timestamp: Date;
        status?: string | undefined;
        notes?: string | undefined;
        changedBy?: mongoose.Types.ObjectId | undefined;
    }[];
    taxDeducted: number;
    netAmount: number;
    periodStart: Date;
    periodEnd: Date;
    paidAt?: Date | undefined;
    paypalEmail?: string | undefined;
    cryptoAddress?: string | undefined;
    invoiceDate?: Date | undefined;
    dueDate?: Date | undefined;
    transactionId?: string | undefined;
    bankDetails?: {
        accountNumber?: string | undefined;
        routingNumber?: string | undefined;
        bankName?: string | undefined;
        accountHolderName?: string | undefined;
    } | undefined;
    notes?: string | undefined;
    paidBy?: mongoose.Types.ObjectId | undefined;
    invoiceNumber?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    posts: {
        post: mongoose.Types.ObjectId;
        likesCount: number;
        viewsCount: number;
        location?: string | undefined;
        earnings?: {
            totalEarnings: number;
            viewEarnings: number;
            likeEarnings: number;
        } | undefined;
    }[];
    totalAmount: number;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    paymentMethod: "bank_transfer" | "paypal" | "crypto" | "check";
    statusHistory: {
        timestamp: Date;
        status?: string | undefined;
        notes?: string | undefined;
        changedBy?: mongoose.Types.ObjectId | undefined;
    }[];
    taxDeducted: number;
    netAmount: number;
    periodStart: Date;
    periodEnd: Date;
    paidAt?: Date | undefined;
    paypalEmail?: string | undefined;
    cryptoAddress?: string | undefined;
    invoiceDate?: Date | undefined;
    dueDate?: Date | undefined;
    transactionId?: string | undefined;
    bankDetails?: {
        accountNumber?: string | undefined;
        routingNumber?: string | undefined;
        bankName?: string | undefined;
        accountHolderName?: string | undefined;
    } | undefined;
    notes?: string | undefined;
    paidBy?: mongoose.Types.ObjectId | undefined;
    invoiceNumber?: string | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    posts: {
        post: mongoose.Types.ObjectId;
        likesCount: number;
        viewsCount: number;
        location?: string | undefined;
        earnings?: {
            totalEarnings: number;
            viewEarnings: number;
            likeEarnings: number;
        } | undefined;
    }[];
    totalAmount: number;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    paymentMethod: "bank_transfer" | "paypal" | "crypto" | "check";
    statusHistory: {
        timestamp: Date;
        status?: string | undefined;
        notes?: string | undefined;
        changedBy?: mongoose.Types.ObjectId | undefined;
    }[];
    taxDeducted: number;
    netAmount: number;
    periodStart: Date;
    periodEnd: Date;
    paidAt?: Date | undefined;
    paypalEmail?: string | undefined;
    cryptoAddress?: string | undefined;
    invoiceDate?: Date | undefined;
    dueDate?: Date | undefined;
    transactionId?: string | undefined;
    bankDetails?: {
        accountNumber?: string | undefined;
        routingNumber?: string | undefined;
        bankName?: string | undefined;
        accountHolderName?: string | undefined;
    } | undefined;
    notes?: string | undefined;
    paidBy?: mongoose.Types.ObjectId | undefined;
    invoiceNumber?: string | undefined;
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
    user: mongoose.Types.ObjectId;
    posts: {
        post: mongoose.Types.ObjectId;
        likesCount: number;
        viewsCount: number;
        location?: string | undefined;
        earnings?: {
            totalEarnings: number;
            viewEarnings: number;
            likeEarnings: number;
        } | undefined;
    }[];
    totalAmount: number;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    paymentMethod: "bank_transfer" | "paypal" | "crypto" | "check";
    statusHistory: {
        timestamp: Date;
        status?: string | undefined;
        notes?: string | undefined;
        changedBy?: mongoose.Types.ObjectId | undefined;
    }[];
    taxDeducted: number;
    netAmount: number;
    periodStart: Date;
    periodEnd: Date;
    paidAt?: Date | undefined;
    paypalEmail?: string | undefined;
    cryptoAddress?: string | undefined;
    invoiceDate?: Date | undefined;
    dueDate?: Date | undefined;
    transactionId?: string | undefined;
    bankDetails?: {
        accountNumber?: string | undefined;
        routingNumber?: string | undefined;
        bankName?: string | undefined;
        accountHolderName?: string | undefined;
    } | undefined;
    notes?: string | undefined;
    paidBy?: mongoose.Types.ObjectId | undefined;
    invoiceNumber?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    posts: {
        post: mongoose.Types.ObjectId;
        likesCount: number;
        viewsCount: number;
        location?: string | undefined;
        earnings?: {
            totalEarnings: number;
            viewEarnings: number;
            likeEarnings: number;
        } | undefined;
    }[];
    totalAmount: number;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    paymentMethod: "bank_transfer" | "paypal" | "crypto" | "check";
    statusHistory: {
        timestamp: Date;
        status?: string | undefined;
        notes?: string | undefined;
        changedBy?: mongoose.Types.ObjectId | undefined;
    }[];
    taxDeducted: number;
    netAmount: number;
    periodStart: Date;
    periodEnd: Date;
    paidAt?: Date | undefined;
    paypalEmail?: string | undefined;
    cryptoAddress?: string | undefined;
    invoiceDate?: Date | undefined;
    dueDate?: Date | undefined;
    transactionId?: string | undefined;
    bankDetails?: {
        accountNumber?: string | undefined;
        routingNumber?: string | undefined;
        bankName?: string | undefined;
        accountHolderName?: string | undefined;
    } | undefined;
    notes?: string | undefined;
    paidBy?: mongoose.Types.ObjectId | undefined;
    invoiceNumber?: string | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    posts: {
        post: mongoose.Types.ObjectId;
        likesCount: number;
        viewsCount: number;
        location?: string | undefined;
        earnings?: {
            totalEarnings: number;
            viewEarnings: number;
            likeEarnings: number;
        } | undefined;
    }[];
    totalAmount: number;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    paymentMethod: "bank_transfer" | "paypal" | "crypto" | "check";
    statusHistory: {
        timestamp: Date;
        status?: string | undefined;
        notes?: string | undefined;
        changedBy?: mongoose.Types.ObjectId | undefined;
    }[];
    taxDeducted: number;
    netAmount: number;
    periodStart: Date;
    periodEnd: Date;
    paidAt?: Date | undefined;
    paypalEmail?: string | undefined;
    cryptoAddress?: string | undefined;
    invoiceDate?: Date | undefined;
    dueDate?: Date | undefined;
    transactionId?: string | undefined;
    bankDetails?: {
        accountNumber?: string | undefined;
        routingNumber?: string | undefined;
        bankName?: string | undefined;
        accountHolderName?: string | undefined;
    } | undefined;
    notes?: string | undefined;
    paidBy?: mongoose.Types.ObjectId | undefined;
    invoiceNumber?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=Payment.d.ts.map