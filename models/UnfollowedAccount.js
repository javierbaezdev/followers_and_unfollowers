// models/UnfollowedAccount.js
import mongoose from 'mongoose';

const unfollowedAccountSchema = new mongoose.Schema(
  {
    unfollowerUsername: {
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
    fullName: String,
    bio: String,
    profileImageUrl: String,

    // ✅ Nuevo campo: Lista blanca
    ignored: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Asegura que no se dupliquen para la misma cuenta y plataforma
unfollowedAccountSchema.index(
  { unfollowerUsername: 1, ownerUsername: 1, platform: 1 },
  { unique: true }
);

const UnfollowedAccount = mongoose.model(
  'UnfollowedAccount',
  unfollowedAccountSchema
);

export default UnfollowedAccount;
