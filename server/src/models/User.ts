import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: String,
  location: String,
  email: {
    type: String,
    unique: true,
  },
  bio: String,
  twitter: String,
  roles: {
    type: Array<String>,
    required: true,
  }
}, {
  timestamps: true,
});

export const User = mongoose.model('Users', userSchema);
