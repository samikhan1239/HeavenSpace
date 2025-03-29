import Config from "../models/config.js";
import User from "../models/user.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Initialize Razorpay safely
const initializeRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error(
      "Razorpay credentials are missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables."
    );
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const razorpay = initializeRazorpay();

// Utility function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Set payment settings for admin and user (superadmin only)

// Set payment settings for admin and user
export const setPayments = async (req, res) => {
  const { adminAmount, userAmount, adminFree, userFree } = req.body;

  try {
    // Input validation
    if (
      (adminFree !== true &&
        (!adminAmount || adminAmount < 0 || isNaN(adminAmount))) ||
      (userFree !== true &&
        (!userAmount || userAmount < 0 || isNaN(userAmount))) ||
      typeof adminFree !== "boolean" ||
      typeof userFree !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input - Amounts must be positive numbers unless free is true",
      });
    }

    const adminSignupAmount = adminFree ? 0 : Math.round(adminAmount * 100);
    const userSignupAmount = userFree ? 0 : Math.round(userAmount * 100);

    await Config.findOneAndUpdate(
      { key: "admin_signup_amount" },
      { key: "admin_signup_amount", value: adminSignupAmount },
      { upsert: true, new: true }
    );

    await Config.findOneAndUpdate(
      { key: "user_signup_amount" },
      { key: "user_signup_amount", value: userSignupAmount },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment settings updated",
      settings: {
        adminAmount: adminSignupAmount / 100,
        userAmount: userSignupAmount / 100,
        adminFree,
        userFree,
      },
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Error updating settings",
    });
  }
};

// Get current payment settings
export const getSettings = async (req, res) => {
  try {
    // Removed req.user check to align with no explicit auth requirement
    const adminConfig = await Config.findOne({ key: "admin_signup_amount" });
    const userConfig = await Config.findOne({ key: "user_signup_amount" });

    const adminAmount = adminConfig ? adminConfig.value / 100 : 0;
    const userAmount = userConfig ? userConfig.value / 100 : 0;
    const adminFree = adminConfig && adminConfig.value === 0;
    const userFree = userConfig && userConfig.value === 0;

    res.status(200).json({
      success: true,
      message: "Payment settings retrieved",
      settings: { adminAmount, userAmount, adminFree, userFree },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching settings",
    });
  }
};

// ... (Other functions like signupOrder, verifyPayment, login, signin remain unchanged)// Create a signup order for user or admin
export const signupOrder = async (req, res) => {
  const { email, username, password, role } = req.body;

  try {
    if (!email || !username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, username, password, and role are required",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role - Must be 'user' or 'admin'",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const configKey =
      role === "admin" ? "admin_signup_amount" : "user_signup_amount";
    const config = await Config.findOne({ key: configKey });
    const signupAmount = config ? config.value : 0;

    if (signupAmount === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        email,
        username,
        password: hashedPassword,
        role,
        paymentPlan: "free",
        isPaid: false,
        paymentStatus: "completed",
        payment_amount: 0,
      });
      await user.save();

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        status: "free",
        message: "Signup is free, registration completed",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        token,
      });
    }

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message:
          "Payment gateway not available - Razorpay credentials are missing",
      });
    }

    const options = {
      amount: signupAmount,
      currency: "INR",
      receipt: `signup_${role}_${email}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      order: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
      userData: { email, username, password, role },
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

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role - Must be 'user' or 'admin'",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "Payment verification not possible - Razorpay secret is missing",
      });
    }

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

    let user = await User.findOne({ email });
    if (!user) {
      const configKey =
        role === "admin" ? "admin_signup_amount" : "user_signup_amount";
      const config = await Config.findOne({ key: configKey });
      const paymentAmount = config ? config.value / 100 : 0;
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        email,
        username,
        password: hashedPassword,
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

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      message: "Payment verified and user created",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        paymentPlan: user.paymentPlan,
        paymentStatus: user.paymentStatus,
        payment_amount: user.payment_amount,
      },
      token,
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

// Login (all roles, with payment check for user/admin only)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Payment check only for user and admin, superadmin bypasses
    if (
      (user.role === "user" || user.role === "admin") &&
      user.paymentStatus !== "completed"
    ) {
      const configKey =
        user.role === "admin" ? "admin_signup_amount" : "user_signup_amount";
      const config = await Config.findOne({ key: configKey });
      const signupAmount = config ? config.value : 10000;

      if (!razorpay) {
        return res.status(500).json({
          success: false,
          message:
            "Payment gateway not available - Razorpay credentials are missing",
        });
      }

      const options = {
        amount: signupAmount,
        currency: "INR",
        receipt: `login_${user.role}_${email}_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      return res.status(402).json({
        success: false,
        message: `Payment required for ${user.role} access`,
        order: {
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          key_id: process.env.RAZORPAY_KEY_ID,
        },
        userData: { email, password, role: user.role },
      });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: `${user.role} login successful`,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        paymentPlan: user.paymentPlan,
        paymentStatus: user.paymentStatus,
        payment_amount: user.payment_amount,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
    });
  }
};

// Signin (admin only, with payment check)
export const signin = async (req, res) => {
  try {
    console.log("Received signin request:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Only admin can use this endpoint",
      });
    }

    if (user.paymentStatus === "free" || user.paymentStatus === "completed") {
      const token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          isPaid: user.isPaid,
          paymentStatus: user.paymentStatus,
        },
        token,
      });
    }

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message:
          "Payment gateway not available - Razorpay credentials are missing",
      });
    }

    const configKey = "admin_signup_amount";
    const config = await Config.findOne({ key: configKey });
    const signupAmount = config ? config.value : 10000;

    const options = {
      amount: signupAmount,
      currency: "INR",
      receipt: `signin_${user.role}_${email}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(402).json({
      success: false,
      message: "Payment required for admin access",
      order: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
      userData: { email, password, role: user.role },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
