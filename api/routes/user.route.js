import express from "express";
import {
  deleteUserListing,
  getUserListings,
  test,
  updateUserListing,
} from "../controllers/user.controller.js";
import { verifyToken } from "../util/verifyUser.js";

const router = express.Router();
router.get("/test", test);
router.get("/listings", verifyToken, getUserListings);
router.get("/listings/:id", verifyToken, getUserListings);
router.put("/listings/:id", verifyToken, updateUserListing);
router.delete("/listings/:id", verifyToken, deleteUserListing);

export default router;
