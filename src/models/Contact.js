import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
  },
  email: {
    type: String,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    required: [true, "Contact type is required"],
    enum: ["work", "home", "personal"],
    default: "personal",
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default mongoose.model("Contact", contactSchema);
