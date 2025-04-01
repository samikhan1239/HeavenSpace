import Listing from "../models/listing.model.js";
import User from "../models/user.model.js"; // Added to fetch user manually

// Error handler utility
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

// Get all listings a user is allowed to see
export const getUserListings = async (req, res) => {
  try {
    console.log("🔥 Route hit: /api/user/listings");
    console.log("Authenticated User:", req.user);

    const authenticatedUserId = req.user.id;
    const userRole = req.user.role;

    let listings;

    if (userRole === "superadmin") {
      // Superadmins see all listings
      listings = await Listing.find();
    } else if (userRole === "admin") {
      // Admins see their own listings
      listings = await Listing.find({ userRef: authenticatedUserId });
    } else {
      // Regular users see only admin-created listings
      const adminUsers = await User.find({ role: "admin" }).select("_id");
      const adminIds = adminUsers.map((user) => user._id.toString()); // Convert to strings
      listings = await Listing.find({ userRef: { $in: adminIds } });
    }

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

// Update a user's listing
export const updateUserListing = async (req, res) => {
  try {
    console.log("🔥 Route hit: /api/user/listings/:id (PUT)");
    console.log("Listing ID:", req.params.id);
    console.log("Request Body:", req.body);
    console.log("Authenticated User:", req.user);

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

    // Authorization: Superadmins can update any listing, others only their own
    if (userRole !== "superadmin" && listing.userRef !== authenticatedUserId) {
      console.warn("⚠️ Unauthorized update attempt by:", authenticatedUserId);
      return res.status(403).json({
        success: false,
        message: "You don’t have permission to update this listing",
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

// Delete a user's listing
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

    // Authorization: Superadmins can delete any listing, others only their own
    if (userRole !== "superadmin" && listing.userRef !== authenticatedUserId) {
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

// Get a specific listing by ID
export const getUserListingById = async (req, res, next) => {
  try {
    console.log("🔥 Route hit: /api/user/listings/:id (GET)");
    console.log("Listing ID:", req.params.id);
    console.log("Authenticated User:", req.user);

    const authenticatedUserId = req.user.id;
    const userRole = req.user.role;
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      console.warn("⚠️ Listing not found:", listingId);
      return next(errorHandler(404, "Listing not found"));
    }

    // Manually fetch the user since userRef is a string
    const creator = await User.findById(listing.userRef);
    const creatorRole = creator?.role;

    console.log("Listing Data:", {
      id: listing._id,
      userRef: listing.userRef,
      user: listing.user,
      creatorRole,
    });

    if (!creator) {
      console.error("❌ No user found for userRef:", listing.userRef);
      return next(errorHandler(500, "Server error: Creator not found"));
    }

    // Authorization logic:
    // - Superadmins can see any listing
    // - Admins can see their own listings or any admin-created listing
    // - Users can see admin-created listings only
    if (
      userRole === "superadmin" ||
      (userRole === "admin" &&
        (listing.userRef === authenticatedUserId || creatorRole === "admin")) ||
      (userRole === "user" && creatorRole === "admin")
    ) {
      console.log("✅ Listing fetched:", listingId);
      return res.status(200).json({ ...listing._doc, user: creator }); // Include creator details
    } else {
      console.warn(
        "⚠️ Unauthorized access attempt by:",
        authenticatedUserId,
        "Creator Role:",
        creatorRole
      );
      return next(
        errorHandler(403, "You are not authorized to view this listing")
      );
    }
  } catch (error) {
    console.error("❌ Error fetching listing:", error.stack);
    next(error);
  }
};
