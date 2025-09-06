import mongoose from 'mongoose';
export declare const Employee: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    role: "admin" | "manager" | "accountant";
    isActive: boolean;
    mobile: string;
    name: string;
    permissions: ("create_employee" | "manage_revenue" | "approve_posts" | "manage_payments" | "view_posts" | "view_dashboard")[];
    loginAttempts: number;
    createdBy?: mongoose.Types.ObjectId | undefined;
    lastLogin?: Date | undefined;
    lockUntil?: Date | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    role: "admin" | "manager" | "accountant";
    isActive: boolean;
    mobile: string;
    name: string;
    permissions: ("create_employee" | "manage_revenue" | "approve_posts" | "manage_payments" | "view_posts" | "view_dashboard")[];
    loginAttempts: number;
    createdBy?: mongoose.Types.ObjectId | undefined;
    lastLogin?: Date | undefined;
    lockUntil?: Date | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    role: "admin" | "manager" | "accountant";
    isActive: boolean;
    mobile: string;
    name: string;
    permissions: ("create_employee" | "manage_revenue" | "approve_posts" | "manage_payments" | "view_posts" | "view_dashboard")[];
    loginAttempts: number;
    createdBy?: mongoose.Types.ObjectId | undefined;
    lastLogin?: Date | undefined;
    lockUntil?: Date | undefined;
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
    email: string;
    password: string;
    role: "admin" | "manager" | "accountant";
    isActive: boolean;
    mobile: string;
    name: string;
    permissions: ("create_employee" | "manage_revenue" | "approve_posts" | "manage_payments" | "view_posts" | "view_dashboard")[];
    loginAttempts: number;
    createdBy?: mongoose.Types.ObjectId | undefined;
    lastLogin?: Date | undefined;
    lockUntil?: Date | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    role: "admin" | "manager" | "accountant";
    isActive: boolean;
    mobile: string;
    name: string;
    permissions: ("create_employee" | "manage_revenue" | "approve_posts" | "manage_payments" | "view_posts" | "view_dashboard")[];
    loginAttempts: number;
    createdBy?: mongoose.Types.ObjectId | undefined;
    lastLogin?: Date | undefined;
    lockUntil?: Date | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    role: "admin" | "manager" | "accountant";
    isActive: boolean;
    mobile: string;
    name: string;
    permissions: ("create_employee" | "manage_revenue" | "approve_posts" | "manage_payments" | "view_posts" | "view_dashboard")[];
    loginAttempts: number;
    createdBy?: mongoose.Types.ObjectId | undefined;
    lastLogin?: Date | undefined;
    lockUntil?: Date | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=Employee.d.ts.map