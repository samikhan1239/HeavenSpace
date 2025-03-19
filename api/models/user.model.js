import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    paymentPlan: {
      type: String,
      enum: ["free", "basic", "premium", "enterprise"],
      default: "free",
    },
    isPaid: { type: Boolean, default: false }, // ✅ Updated: Track if user has paid
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending", // ✅ New field for payment tracking
    },
    transactionId: { type: String, default: null }, // ✅ Store transaction ID
    isActive: { type: Boolean, default: true }, // Account status
    payment_amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
