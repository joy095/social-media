import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'City is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  pricePerView: {
    type: Number,
    required: [true, 'Price per view is required'],
    min: [0.01, 'Price per view must be at least 0.01']
  },
  pricePerLike: {
    type: Number,
    required: [true, 'Price per like is required'],
    min: [0.01, 'Price per like must be at least 0.01']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
revenueSchema.index({ city: 1 });
revenueSchema.index({ isActive: 1 });

// Static method to get pricing for a city
revenueSchema.statics.getPricingForCity = async function (city) {
  return await this.findOne({
    city: city.toUpperCase(),
    isActive: true
  });
};

// Static method to get all active pricing
revenueSchema.statics.getAllActivePricing = async function () {
  return await this.find({ isActive: true }).sort({ city: 1 });
};

export const Revenue = mongoose.model('Revenue', revenueSchema);
