import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.route.js";
import paymentRoutes from "./routes/payment.route.js";

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
    console.log(process.env.RAZORPAY_KEY_ID);
    console.log(process.env.RAZORPAY_KEY_SECRET);
    console.log(process.env.CLOUDINARY_CLOUD_NAME);
    console.log(process.env.CLOUDINARY_API_KEY);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter);

app.use("/api/auth", authRouter);

app.use("/api/listings", listingRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
