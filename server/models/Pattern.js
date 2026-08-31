import mongoose from 'mongoose';

const patternSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pattern name is required'],
      trim: true,
      maxlength: [120, 'Pattern name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [6000, 'Description cannot exceed 6000 characters'],
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
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Beginner', 'Easy', 'Intermediate', 'Advanced'],
    },
    materials: {
      type: String,
      required: [true, 'Materials are required'],
      trim: true,
    },
    estimatedSkill: {
      type: String,
      trim: true,
      default: '',
    },
    additionalInfo: {
      type: String,
      trim: true,
      default: '',
    },
    hookSize: {
      type: String,
      trim: true,
      default: '',
    },
    yarnWeight: {
      type: String,
      trim: true,
      default: '',
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

patternSchema.index({ name: 'text', description: 'text' });
patternSchema.index({ name: 1 });
patternSchema.index({ category: 1, difficulty: 1 });
patternSchema.index({ featured: 1, createdAt: -1 });

export const Pattern = mongoose.model('Pattern', patternSchema);
