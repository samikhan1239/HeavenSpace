import Listing from "../models/listing.model.js";
import jwt from "jsonwebtoken";

export const test = (req, res) => {
  res.json({
    message: "Hello World!",
  });
};

export const getUserListings = async (req, res) => {
  try {
    console.log("🔥 Route hit: /api/user/listings");
    console.log("Authenticated User:", req.user);

    const authenticatedUserId = req.user.id; // Set by verifyToken middleware

    // Fetch listings for the authenticated user
    const listings = await Listing.find({ userRef: authenticatedUserId });

    if (!listings.length) {
      console.warn("⚠️ No listings found for user:", authenticatedUserId);
      return res.status(200).json({
        success: true,
        listings: [],
        message: "No listings found",
      });
    }

    console.log("✅ Listings found:", listings);
    return res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("❌ Error fetching listings:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Server error fetching listings",
      error: error.message,
    });
  }
};
export const updateUserListing = async (req, res) => {
  try {
    console.log("🔥 Route hit: /api/user/listings/:id (PUT)");
    console.log("Listing ID:", req.params.id);
    console.log("Request Body:", req.body);
    console.log("Authenticated User:", req.user);

    const authenticatedUserId = req.user.id;
    const listingId = req.params.id;

    const listing = await Listing.findOne({
      _id: listingId,
      userRef: authenticatedUserId,
    });

    if (!listing) {
      console.warn("⚠️ Listing not found or unauthorized:", listingId);
      return res.status(404).json({
        success: false,
        message: "Listing not found or you don’t have access",
      });
    }

    // Update listing with new data
    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      { $set: req.body },
      { new: true }
    );

    console.log("✅ Listing updated:", updatedListing);
    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: {
        id: updatedListing._id.toString(),
        ...updatedListing._doc,
      },
    });
  } catch (error) {
    console.error("❌ Error updating listing:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error updating listing",
      error: error.message,
    });
  }
};
export const deleteUserListing = async (req, res) => {
  try {
    console.log("🔥 Route hit: /api/user/listings/:id (DELETE)");
    console.log("Listing ID:", req.params.id);
    console.log("Authenticated User:", req.user);

    const authenticatedUserId = req.user.id;
    const listingId = req.params.id;

    const listing = await Listing.findOne({
      _id: listingId,
      userRef: authenticatedUserId,
    });

    if (!listing) {
      console.warn("⚠️ Listing not found or unauthorized:", listingId);
      return res.status(404).json({
        success: false,
        message: "Listing not found or you don’t have access",
      });
    }

    await Listing.findByIdAndDelete(listingId);

    console.log("✅ Listing deleted:", listingId);
    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting listing:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error deleting listing",
      error: error.message,
    });
  }
};
