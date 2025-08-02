const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Base pricing (in base currency - XAF)
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Currency for the base price
  currency: {
    type: String,
    uppercase: true,
    default: 'XAF',
  },
  
  // Multi-currency pricing
  pricing: [{
    currency: {
      type: String,
      uppercase: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  }],
  
  // Duration in minutes
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  
  // Single image field (like categories)
  image: {
    type: String,
    trim: true,
  },
  
  // Category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  
  // Staff assignment
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // staff are users with role 'staff'
  }],
  
  // Service configuration
  requiresStaff: {
    type: Boolean,
    default: true,
  },
  
  // Service status
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'maintenance'],
    default: 'draft',
  },
  
  // Additional information
  specialInstructions: {
    type: String,
    trim: true,
  },
  
  cancellationPolicy: {
    type: String,
    trim: true,
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true,
  }],
  
  // SEO fields
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  
  metaTitle: {
    type: String,
    trim: true,
  },
  
  metaDescription: {
    type: String,
    trim: true,
  },
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if staff is assigned
serviceSchema.virtual('isStaffAssigned').get(function() {
  return this.staff.length > 0;
});

// Virtual for checking if service is bookable
serviceSchema.virtual('isBookable').get(function() {
  if (this.status !== 'active') return false;
  if (this.requiresStaff && this.staff.length === 0) return false;
  return true;
});

// Virtual for getting active pricing
serviceSchema.virtual('activePricing').get(function() {
  return this.pricing.filter(p => p.isActive);
});

// Index for better query performance
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ staff: 1 });
serviceSchema.index({ slug: 1 });

// Pre-save middleware to generate slug if not provided
serviceSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to get price in specific currency
serviceSchema.methods.getPrice = function(currencyCode = 'XAF') {
  // Check if we have specific pricing for this currency
  const specificPricing = this.pricing.find(p => 
    p.currency === currencyCode.toUpperCase() && p.isActive
  );
  
  if (specificPricing) {
    return specificPricing.price;
  }
  
  // Return base price if no specific pricing found
  return this.basePrice;
};

// Method to check if service is available for booking
serviceSchema.methods.isAvailable = function() {
  return this.isBookable;
};

// Method to assign staff to service
serviceSchema.methods.assignStaff = function(staffIds) {
  this.staff = staffIds;
  return this.save();
};

// Method to activate service
serviceSchema.methods.activate = function() {
  if (this.requiresStaff && this.staff.length === 0) {
    throw new Error('Service requires staff assignment before activation');
  }
  this.status = 'active';
  return this.save();
};

// Method to deactivate service
serviceSchema.methods.deactivate = function() {
  this.status = 'inactive';
  return this.save();
};

module.exports = mongoose.model('Service', serviceSchema); 