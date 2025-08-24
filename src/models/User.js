import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for user'],
    },
    email: {
      type: String,
      required: [true, 'Set email for user'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('User', userSchema);
