import User from "../models/user.model.js";
import Config from "../models/config.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // For password hashing

// Function to initialize Razorpay with error checking
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing in environment variables"
    );
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create a signup order
export const signupOrder = async (req, res) => {
  const { email, username, password, role = "user" } = req.body;

  try {
    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, username, and password are required",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role - Must be 'user' or 'admin'",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Get signup amount based on role
    const configKey =
      role === "admin" ? "admin_signup_amount" : "user_signup_amount";
    const config = await Config.findOne({ key: configKey });
    const signupAmount = config ? config.value : 0;

    // If free, create user immediately
    if (signupAmount === 0) {
      user = new User({
        email,
        username,
        password: bcrypt.hashSync(password, 10), // Hash password
        role,
        paymentPlan: "free",
        isPaid: false,
        paymentStatus: "completed",
        payment_amount: 0,
      });
      await user.save();
      return res.status(200).json({
        success: true,
        status: "free",
        message: "Signup is free, proceed to login",
        userId: user._id,
      });
    }

    // Create Razorpay order
    const razorpayInstance = getRazorpayInstance();
    const options = {
      amount: signupAmount, // In paise
      currency: "INR",
      receipt: `signup_${role}_${email}_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      order: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
      userData: {
        email,
        username,
        password: bcrypt.hashSync(password, 10), // Send hashed password
        role,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
};

// Verify payment and update user
export const verifyPayment = async (req, res) => {
  const { email, username, password, role, payment_id, order_id, signature } =
    req.body;

  try {
    // Validate input
    if (
      !email ||
      !username ||
      !password ||
      !role ||
      !payment_id ||
      !order_id ||
      !signature
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields and payment details are required",
      });
    }

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }

    // Create or update user
    let user = await User.findOne({ email });
    if (!user) {
      const configKey =
        role === "admin" ? "admin_signup_amount" : "user_signup_amount";
      const config = await Config.findOne({ key: configKey });
      const paymentAmount = config ? config.value / 100 : 0;

      user = new User({
        email,
        username,
        password, // Already hashed from signupOrder
        role,
        paymentPlan: "basic",
        isPaid: true,
        paymentStatus: "completed",
        transactionId: payment_id,
        payment_amount: paymentAmount,
      });
      await user.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    res.status(201).json({
      success: true,
      message: "Payment verified and user created",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        paymentStatus: user.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or username already registered",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
    });
  }
};
