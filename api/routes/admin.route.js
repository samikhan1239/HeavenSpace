import express from "express";
import {
  setPayments,
  getSettings,
  signupOrder,
  verifyPayment,
  login,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/set-payments", setPayments);
router.get("/get-settings", getSettings);
router.post("/signup-order", signupOrder);
router.post("/verify-payment", verifyPayment);
router.post("/login", login);

export default router;
