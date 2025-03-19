import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // 'admin_signup_amount' or 'user_signup_amount'
  value: { type: mongoose.Mixed, required: true }, // Amount in paise
});

const Config = mongoose.model("Config", configSchema);

export default Config;
