import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Signup Controller
export const signup = async (req, res) => {
  try {
    console.log("Received request:", req.body);
    const { username, email, password, role } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username or Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default payment settings
    const isPaid = true; // ✅ Both admins and users are marked as paid
    const paymentStatus = "completed"; // ✅ Payment status is completed

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isPaid,
      paymentStatus,
    });
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    // Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isPaid: newUser.isPaid,
        paymentStatus: newUser.paymentStatus,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Signin Controller
export const signin = async (req, res) => {
  try {
    console.log("Received login request:", req.body);
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check if the account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Contact support.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check payment status for admins
    if (user.role === "admin" && !user.isPaid) {
      return res
        .status(403)
        .json({ success: false, message: "Payment required for admin access" });
    }

    // Generate token
    const token = generateToken(user);

    // Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
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
  } catch (error) {
    console.error("Signin error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Logout Controller (optional)
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });

  res.status(200).json({ success: true, message: "Logout successful" });
};
