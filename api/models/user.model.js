import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    paymentPlan: {
      type: String,
      enum: ["free", "basic", "premium", "enterprise"], // Different payment levels
      default: "free",
    },
    isPaid: { type: Boolean, default: false }, // Payment status for login
    isActive: { type: Boolean, default: true }, // Account status
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
