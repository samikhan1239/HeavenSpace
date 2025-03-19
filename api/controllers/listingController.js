// controllers/listingController.js
import Listing from "../models/listing.model.js";

export const getAllListings = async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments();
    const listings = await Listing.find() // Removed status filter
      .sort({ createdAt: -1 });

    console.log("Backend - Total Listings in DB:", totalListings);
    console.log("Backend - All Listings Fetched:", listings);

    if (!listings.length) {
      return res.status(200).json({
        message: "No listings found",
        listings: [],
        success: true,
      });
    }

    res.status(200).json({
      message: "Listings retrieved successfully",
      listings,
      success: true,
    });
  } catch (error) {
    console.error("Backend - Error fetching listings:", error.message);
    res.status(500).json({
      message: "Error fetching listings",
      error: error.message,
      success: false,
    });
  }
};

export const getListingsByType = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type) {
      return res.status(400).json({
        message: "Type parameter is required",
        success: false,
      });
    }

    const listings = await Listing.find({ type }) // Removed status filter
      .sort({ createdAt: -1 });

    console.log(`Backend - Listings by Type (${type}) Fetched:`, listings);

    if (!listings.length) {
      return res.status(200).json({
        message: `No listings found for type: ${type}`,
        listings: [],
        success: true,
      });
    }

    res.status(200).json({
      message: `Listings of type ${type} retrieved successfully`,
      listings,
      success: true,
    });
  } catch (error) {
    console.error("Backend - Error fetching listings by type:", error.message);
    res.status(500).json({
      message: "Error fetching listings by type",
      error: error.message,
      success: false,
    });
  }
};
