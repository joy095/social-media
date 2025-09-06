import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Payment must be associated with a user']
  },
  posts: [{
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: true
    },
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
    viewsCount: {
      type: Number,
      default: 0
    },
    likesCount: {
      type: Number,
      default: 0
    },
    location: String
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'paypal', 'crypto', 'check'],
    required: [true, 'Payment method is required']
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  bankDetails: {
    accountNumber: String,
    routingNumber: String,
    bankName: String,
    accountHolderName: String
  },
  paypalEmail: String,
  cryptoAddress: String,
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  paidBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee'
  },
  paidAt: Date,
  // Audit trail
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'Employee'
    },
    notes: String
  }],
  // Tax information
  taxDeducted: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    default: 0
  },
  // Invoice details
  invoiceNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  invoiceDate: Date,
  dueDate: Date,
  // Period covered by this payment
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ paidAt: -1 });
paymentSchema.index({ periodStart: 1, periodEnd: 1 });
paymentSchema.index({ invoiceNumber: 1 });
paymentSchema.index({ transactionId: 1 });

// Virtual for calculating processing time
paymentSchema.virtual('processingTime').get(function() {
  if (this.paidAt) {
    return Math.floor((this.paidAt - this.createdAt) / (1000 * 60 * 60 * 24)); // days
  }
  return null;
});

// Generate unique invoice number
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV-${year}${month}${day}-${random}`;
  }
  
  // Calculate net amount
  if (this.isModified('totalAmount') || this.isModified('taxDeducted')) {
    this.netAmount = this.totalAmount - this.taxDeducted;
  }
  
  next();
});

// Method to add status change to history
paymentSchema.methods.updateStatus = function(newStatus, changedBy, notes = '') {
  this.statusHistory.push({
    status: this.status,
    changedBy,
    notes,
    timestamp: new Date()
  });
  
  this.status = newStatus;
  
  if (newStatus === 'completed') {
    this.paidAt = new Date();
  }
  
  return this.save();
};

// Method to calculate total earnings from posts
paymentSchema.methods.calculateTotalEarnings = function() {
  let total = 0;
  this.posts.forEach(post => {
    total += post.earnings.totalEarnings;
  });
  this.totalAmount = total;
  return total;
};

// Method to generate transaction ID
paymentSchema.methods.generateTransactionId = function() {
  if (!this.transactionId) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.transactionId = `TXN-${timestamp}-${random}`;
  }
  return this.transactionId;
};

// Static method to get payments for a period
paymentSchema.statics.getPaymentsForPeriod = function(startDate, endDate) {
  return this.find({
    periodStart: { $gte: startDate },
    periodEnd: { $lte: endDate }
  }).populate('user', 'fullName email username')
    .populate('posts.post', 'content location createdAt')
    .populate('paidBy', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to get user's payment history
paymentSchema.statics.getUserPaymentHistory = function(userId) {
  return this.find({ user: userId })
    .populate('posts.post', 'content location createdAt')
    .sort({ createdAt: -1 });
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);
  
  const totalPending = await this.countDocuments({ status: 'pending' });
  const totalProcessing = await this.countDocuments({ status: 'processing' });
  const totalCompleted = await this.countDocuments({ status: 'completed' });
  
  return {
    byStatus: stats,
    totalPending,
    totalProcessing,
    totalCompleted,
    totalPayments: await this.countDocuments()
  };
};

export const Payment = mongoose.model('Payment', paymentSchema);
