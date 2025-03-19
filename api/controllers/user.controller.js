import Listing from "../models/listing.model.js";
import jwt from "jsonwebtoken"; // Imported but not directly used here - kept for consistency

// Error handler utility (should be defined somewhere in your codebase)
const errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

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

    const listings = await Listing.find({ userRef: authenticatedUserId });

    if (!listings.length) {
      console.warn("⚠️ No listings found for user:", authenticatedUserId);
      return res.status(200).json({
        success: true,
        listings: [],
        message: "No listings found",
      });
    }

    console.log("✅ Listings found:", listings.length);
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

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      { $set: req.body },
      { new: true }
    );

    console.log("✅ Listing updated:", updatedListing._id);
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

    if (!req.user) {
      console.error("❌ No authenticated user found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const authenticatedUserId = req.user.id;
    const userRole = req.user.role;
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      console.warn("⚠️ Listing not found:", listingId);
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    if (
      userRole !== "superadmin" &&
      listing.userRef.toString() !== authenticatedUserId
    ) {
      console.warn("⚠️ Unauthorized deletion attempt by:", authenticatedUserId);
      return res.status(403).json({
        success: false,
        message: "You don’t have permission to delete this listing",
      });
    }

    await Listing.findByIdAndDelete(listingId);

    console.log("✅ Listing deleted:", listingId);
    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting listing:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Server error deleting listing",
      error: error.message,
    });
  }
};

export const getUserListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (
      req.user.id !== listing.userRef.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "superadmin"
    ) {
      return next(
        errorHandler(403, "You are not authorized to view this listing")
      );
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
