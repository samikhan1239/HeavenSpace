import express from "express";
import { getUserListings, test } from "../controllers/user.controller.js";
import { verifyToken } from "../util/verifyUser.js";

const router = express.Router();
router.get("/test", test);
router.get("/listings/:id", verifyToken, getUserListings);

export default router;
