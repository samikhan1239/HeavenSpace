import Config from "../models/config.js";
import User from "../models/user.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});

// Set payment settings for admin and user
export const setPayments = async (req, res) => {
  const { adminAmount, userAmount, adminFree, userFree } = req.body;

  try {
    const adminSignupAmount = adminFree ? 0 : adminAmount * 100;
    const userSignupAmount = userFree ? 0 : userAmount * 100;

    await Config.findOneAndUpdate(
      { key: "admin_signup_amount" },
      { key: "admin_signup_amount", value: adminSignupAmount },
      { upsert: true }
    );

    await Config.findOneAndUpdate(
      { key: "user_signup_amount" },
      { key: "user_signup_amount", value: userSignupAmount },
      { upsert: true }
    );

    res.json({
      message: "Payment settings updated",
      adminAmount: adminSignupAmount / 100,
      userAmount: userSignupAmount / 100,
      adminFree,
      userFree,
    });
  } catch (error) {
    res.status(500).send("Error updating settings");
  }
};

// Get current payment settings
export const getSettings = async (req, res) => {
  try {
    const adminConfig = await Config.findOne({ key: "admin_signup_amount" });
    const userConfig = await Config.findOne({ key: "user_signup_amount" });

    const adminAmount = adminConfig ? adminConfig.value / 100 : 0;
    const userAmount = userConfig ? userConfig.value / 100 : 0;
    const adminFree = adminConfig && adminConfig.value === 0;
    const userFree = userConfig && userConfig.value === 0;

    res.json({ adminAmount, userAmount, adminFree, userFree });
  } catch (error) {
    res.status(500).send("Error fetching settings");
  }
};

// Create a signup order for admin
export const signupOrder = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, role: "admin" });
      await user.save();
    }

    const config = await Config.findOne({ key: "admin_signup_amount" });
    const signupAmount = config ? config.value : 0;

    if (signupAmount === 0) {
      user.payment_status = "free";
      await user.save();
      return res.json({
        status: "free",
        message: "Signup is free, proceed to login",
      });
    }

    const options = {
      amount: signupAmount,
      currency: "INR",
      receipt: `receipt_${email}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: "YOUR_KEY_ID",
    });
  } catch (error) {
    res.status(500).send("Error creating order");
  }
};

// Verify admin payment
export const verifyPayment = async (req, res) => {
  const { email, payment_id, order_id, signature } = req.body;

  try {
    const generatedSignature = crypto
      .createHmac("sha256", "YOUR_KEY_SECRET")
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature === signature) {
      const user = await User.findOne({ email });
      user.payment_status = "paid";
      user.payment_amount =
        (await Config.findOne({ key: "admin_signup_amount" })).value / 100;
      await user.save();
      res.json({ status: "success", message: "Payment verified" });
    } else {
      res.status(400).send("Payment verification failed");
    }
  } catch (error) {
    res.status(500).send("Error verifying payment");
  }
};

// Admin login
export const login = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email, role: "admin" });

    if (
      !user ||
      (user.payment_status !== "paid" && user.payment_status !== "free")
    ) {
      return res.status(403).send("Payment required to log in");
    }

    res.json({
      message: "Admin login successful",
      status: user.payment_status,
    });
  } catch (error) {
    res.status(500).send("Error during login");
  }
};
