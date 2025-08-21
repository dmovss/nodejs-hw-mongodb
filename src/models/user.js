import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('users', userSchema);
