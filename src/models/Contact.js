import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: { type: String },
    phone: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    contactType: { type: String, enum: ['home', 'work', 'personal'], default: 'personal' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('contacts', contactSchema);
