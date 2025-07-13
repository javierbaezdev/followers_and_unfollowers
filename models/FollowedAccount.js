// models/FollowedAccount.js
import mongoose from 'mongoose';

const followedAccountSchema = new mongoose.Schema(
  {
    followedUsername: {
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
  },
  {
    timestamps: true,
  }
);

followedAccountSchema.index(
  { followedUsername: 1, ownerUsername: 1, platform: 1 },
  { unique: true } // Evita duplicados para el mismo usuario y red social
);

const FollowedAccount = mongoose.model(
  'FollowedAccount',
  followedAccountSchema
);
export default FollowedAccount;
