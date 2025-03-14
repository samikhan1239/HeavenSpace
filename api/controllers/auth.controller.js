import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const { username, email, password, role } = req.body;

    // ✅ Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }], // Check both fields
    });

    if (existingUser) {
      console.log("Username or Email already exists");
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default payment settings
    const isPaid = role === "admin" ? false : true;
    const paymentStatus = role === "admin" ? "pending" : "completed";

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

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("User registered successfully");

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
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

    // ✅ Handle MongoDB Duplicate Key Error
    if (error.code === 11000) {
      return res.status(400).json({
        message: `Duplicate Key Error: ${Object.keys(error.keyPattern).join(
          ", "
        )} already exists`,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    console.log("Received login request:", req.body);
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the account is active
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Account is deactivated. Contact support." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check payment status for admins
    if (user.role === "admin" && !user.isPaid) {
      return res
        .status(403)
        .json({ message: "Payment required for admin access" });
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("User logged in successfully");
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
