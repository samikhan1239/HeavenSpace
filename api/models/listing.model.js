const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    facilities: { type: [String], required: true }, // ✅ Changed to Array
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    location: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // Store image URL or use a buffer
    phoneNo: { type: String, required: true },
    availability: {
      type: String,
      enum: ["Available", "Not Available"], // ✅ Ensure this matches products.js
      default: "Available",
    },
    availableRooms: { type: Number, required: true, default: 0 },
    roomType: { type: String },
    genderPreference: {
      type: String,
      enum: ["Male", "Female", "Any"], // ✅ Fixed to match products.js
      required: true,
    },
    furnishing: { type: String },
    securityDeposit: { type: Number },
    leaseDuration: { type: String },
    nearbyLandmarks: { type: [String] }, // ✅ Changed to Array
    parkingAvailable: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false }, // ✅ Changed from String to Boolean
    bathroomType: {
      type: String,
      enum: ["Attached", "Common"], // ✅ Fixed to match products.js
      default: "Attached",
    },
    bedCount: { type: Number },
    laundryServices: { type: Boolean, default: false },
    mealsIncluded: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    waterSupply: { type: String },
    electricityBackup: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    securityGuard: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    commonArea: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    housekeeping: { type: Boolean, default: false },
    listingType: {
      type: String,
      enum: ["Direct Owner", "Broker"],
      required: true,
    }, // ✅ Fixed Enum
    brokerName: { type: String },
    brokeragePrice: { type: Number },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 100 },
    tags: { type: [String] }, // ✅ Changed to Array
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

module.exports = mongoose.model("Listing", listingSchema);
