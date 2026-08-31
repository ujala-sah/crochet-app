import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [4000, 'Description cannot exceed 4000 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [240, 'Short description cannot exceed 240 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    productType: {
      type: String,
      trim: true,
      default: 'Handmade Piece',
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    availability: {
      type: String,
      enum: ['in-stock', 'made-to-order', 'sold-out'],
      default: 'in-stock',
    },
    image: {
      type: String,
      required: [true, 'Primary image URL is required'],
      trim: true,
    },
    additionalImages: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1, createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);
