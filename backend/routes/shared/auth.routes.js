import express from "express";
import {
  sendVerifyOtp,
  verifyOtp,
} from "../../controllers/shared/auth.controller.js";
import {
  validateSendVerifyOtp,
  validateVerifyOtp,
} from "../../middleware/shared/validations.middleware.js";

const router = express.Router();

// base: /api/shared/auth
// POST /send-verify-otp – Send OTP for verification (email)
router.post("/send-verify-otp", validateSendVerifyOtp, sendVerifyOtp);
// POST /verify-otp – Verify the OTP code
router.post("/verify-otp", validateVerifyOtp, verifyOtp);

export default router;
