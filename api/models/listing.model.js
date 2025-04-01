import mongoose from "mongoose"; // ✅ Use `import` instead of `require`

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    description: { type: String },
    facilities: { type: [String] },
    price: { type: Number },
    discountPrice: { type: Number },
    location: { type: String },
    category: { type: String },
    image: [{ type: String }],
    phoneNo: { type: String },
    availability: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
    availableRooms: { type: Number, default: 0 },
    roomType: { type: String },
    genderPreference: {
      type: String,
      enum: ["Male", "Female", "Any"],
    },
    furnishing: { type: String },
    securityDeposit: { type: Number },
    leaseDuration: { type: String },
    nearbyLandmarks: { type: [String] },
    parkingAvailable: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    bathroomType: {
      type: String,
      enum: ["Attached", "Common"],
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
    },
    brokerName: { type: String },
    brokeragePrice: { type: Number },
    ownerName: { type: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 100 },
    tags: { type: [String] },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userRef: {
      type: String,
    },

    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing; // ✅ Export properly
