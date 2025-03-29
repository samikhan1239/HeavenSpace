import express from "express";
import {
  signupOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/signupOrder", signupOrder);
router.post("/verifyPayment", verifyPayment);

export default router;
