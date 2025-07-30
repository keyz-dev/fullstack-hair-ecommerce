const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    maxLength: 200,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  currency: {
    type: String,
    required: true,
    default: 'XAF',
    uppercase: true,
  },
  images: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  
  // Hair-specific variants
  variants: [{
    name: { type: String, required: true }, // e.g., "Length", "Color", "Style"
    options: [{ type: String }], // e.g., ["Short", "Medium", "Long"]
    required: { type: Boolean, default: false }
  }],
  
  // Hair-specific specifications
  specifications: {
    length: { type: String }, // e.g., "Short", "Medium", "Long"
    texture: { type: String }, // e.g., "Straight", "Wavy", "Curly"
    material: { type: String }, // e.g., "Human Hair", "Synthetic", "Blend"
    weight: { type: String }, // e.g., "100g", "150g"
    density: { type: String }, // e.g., "Light", "Medium", "Heavy"
    capSize: { type: String }, // e.g., "Small", "Medium", "Large"
    hairType: { type: String }, // e.g., "Virgin", "Remy", "Non-Remy"
    origin: { type: String }, // e.g., "Brazilian", "Peruvian", "Indian"
    careInstructions: { type: String },
    warranty: { type: String },
  },
  
  // Key features for hair products
  features: [{
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String } // Optional icon class
  }],
  
  // Tags for better search and categorization
  tags: [String],
  
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  
  // Status and visibility
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  
  // Service association
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for is on sale
productSchema.virtual('isOnSaleVirtual').get(function() {
  return this.originalPrice && this.originalPrice > this.price;
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isOnSale: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
