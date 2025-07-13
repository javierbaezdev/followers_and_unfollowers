// models/IgnoredAccount.js
import mongoose from 'mongoose';

const ignoredAccountSchema = new mongoose.Schema(
  {
    ignoredUsername: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ownerUsername: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ['instagram', 'tiktok'],
    },
    reason: String, // opcional
  },
  {
    timestamps: true,
  }
);

ignoredAccountSchema.index(
  { ignoredUsername: 1, ownerUsername: 1, platform: 1 },
  { unique: true }
);

export default mongoose.model('IgnoredAccount', ignoredAccountSchema);
