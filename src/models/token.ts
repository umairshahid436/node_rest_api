import mongoose, { Schema } from 'mongoose';

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60, // Token will be automatically deleted after 24 hours
  },
});

export const BlacklistedToken = mongoose.model('BlacklistedToken', tokenSchema);
