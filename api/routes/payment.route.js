import express from "express";
import {
  login,
  signupOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/signup-order", signupOrder);
router.post("/verify-payment", verifyPayment);
router.post("/login", login);

export default router;
