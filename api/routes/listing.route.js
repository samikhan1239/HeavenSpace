import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import {
  getAllListings,
  getListingsByType,
} from "../controllers/listingController.js";

const router = express.Router();

router.post("/create", createListing);
// Get all listings
router.get("/admin", getAllListings);
router.get("/type", getListingsByType);

export default router;
