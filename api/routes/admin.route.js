import express from "express";
import {
  setPayments,
  getSettings,
  signupOrder,
  verifyPayment,
  login,
  signin,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/set-payments", setPayments);
router.get("/get-settings", getSettings);
router.post("/signupOrder", signupOrder);
router.post("/signin", signin);
router.post("/verifyPayment", verifyPayment);
router.post("/login", login);

export default router;
