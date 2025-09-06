import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'accountant'],
        required: [true, 'Role is required']
    },
    permissions: [{
            type: String,
            enum: [
                'create_employee',
                'manage_revenue',
                'approve_posts',
                'manage_payments',
                'view_posts',
                'view_dashboard'
            ]
        }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee'
    },
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes
employeeSchema.index({ email: 1 });
employeeSchema.index({ role: 1 });
employeeSchema.index({ isActive: 1 });
// Virtual for checking if account is locked
employeeSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});
// Hash password before saving
employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Set permissions based on role
employeeSchema.pre('save', function (next) {
    if (this.isModified('role') || this.isNew) {
        switch (this.role) {
            case 'admin':
                this.permissions = [
                    'create_employee',
                    'manage_revenue',
                    'approve_posts',
                    'manage_payments',
                    'view_posts',
                    'view_dashboard'
                ];
                break;
            case 'manager':
                this.permissions = [
                    'manage_revenue',
                    'approve_posts',
                    'view_posts',
                    'view_dashboard'
                ];
                break;
            case 'accountant':
                this.permissions = [
                    'manage_payments',
                    'view_posts',
                    'view_dashboard'
                ];
                break;
        }
    }
    next();
});
// Compare password method
employeeSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
// Method to handle login attempts and account locking
employeeSchema.methods.incLoginAttempts = function () {
    const maxLoginAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; // 2 hours
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= maxLoginAttempts && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }
    return this.updateOne(updates);
};
// Method to reset login attempts on successful login
employeeSchema.methods.resetLoginAttempts = function () {
    return this.updateOne({
        $unset: {
            loginAttempts: 1,
            lockUntil: 1
        },
        $set: {
            lastLogin: new Date()
        }
    });
};
// Method to check if employee has permission
employeeSchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission);
};
// Remove sensitive information when converting to JSON
employeeSchema.methods.toJSON = function () {
    const employeeObject = this.toObject();
    delete employeeObject.password;
    delete employeeObject.__v;
    delete employeeObject.loginAttempts;
    delete employeeObject.lockUntil;
    return employeeObject;
};
export const Employee = mongoose.model('Employee', employeeSchema);
//# sourceMappingURL=Employee.js.map