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
      enum: ['instagram', 'tiktok', 'twitter', 'facebook', 'linkedin'],
    },
    fullName: String,
    bio: String,
    profileImageUrl: String,
  },
  {
    timestamps: true,
  }
);

unfollowedAccountSchema.index(
  { unfollowerUsername: 1, ownerUsername: 1, platform: 1 },
  { unique: true }
);

const UnfollowedAccount = mongoose.model(
  'UnfollowedAccount',
  unfollowedAccountSchema
);
export default UnfollowedAccount;
