import User from "../models/user.model.js";
import Config from "../models/config.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});

export const signupOrder = async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, role: "user" });
    await user.save();
  }

  const config = await Config.findOne({ key: "user_signup_amount" });
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

  try {
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

export const verifyPayment = async (req, res) => {
  const { email, payment_id, order_id, signature } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", "YOUR_KEY_SECRET")
    .update(order_id + "|" + payment_id)
    .digest("hex");

  if (generatedSignature === signature) {
    const user = await User.findOne({ email });
    user.payment_status = "paid";
    user.payment_amount =
      (await Config.findOne({ key: "user_signup_amount" })).value / 100;
    await user.save();
    res.json({ status: "success", message: "Payment verified" });
  } else {
    res.status(400).send("Payment verification failed");
  }
};

export const login = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, role: "user" });

  if (
    !user ||
    (user.payment_status !== "paid" && user.payment_status !== "free")
  ) {
    return res.status(403).send("Payment required to log in");
  }
  res.json({ message: "User login successful", status: user.payment_status });
};
