import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [30, "Name cannot exceed 30 characters"]
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [3, "Phone number must be at least 3 characters"],
    maxlength: [20, "Phone number cannot exceed 20 characters"]
  },
  email: {
    type: String,
    validate: {
      validator: v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: props => `${props.value} is not a valid email address!`
    }
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    required: [true, "Contact type is required"],
    enum: {
      values: ["work", "home", "personal"],
      message: "Contact type must be work, home, or personal"
    },
    default: "personal",
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default mongoose.model("Contact", contactSchema);
