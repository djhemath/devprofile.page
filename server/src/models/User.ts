import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
}, {
  timestamps: true,
});

export const User = mongoose.model('Users', userSchema);
