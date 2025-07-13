// models/ScriptExecutionLog.js
import mongoose from 'mongoose';

const scriptExecutionLogSchema = new mongoose.Schema(
  {
    scriptName: {
      type: String,
      required: true,
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
    executedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Incluye createdAt / updatedAt
  }
);

scriptExecutionLogSchema.index(
  { scriptName: 1, ownerUsername: 1, platform: 1 },
  { unique: true } // 1 registro por script/cuenta/plataforma
);

const ScriptExecutionLog = mongoose.model(
  'ScriptExecutionLog',
  scriptExecutionLogSchema
);
export default ScriptExecutionLog;
