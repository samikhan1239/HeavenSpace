import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema({
  userSignupPrice: {
    type: Number,
    required: true,
    default: 500, // Default price for user role (e.g., INR)
  },
  adminSignupPrice: {
    type: Number,
    required: true,
    default: 1000, // Default price for admin role (e.g., INR)
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PaymentSettings", paymentSettingsSchema);
