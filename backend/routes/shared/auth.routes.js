import express from "express";
import { sendVerifyOtp, verifyOtp } from "../../controllers/shared/auth.controller.js";
import { validateSendVerifyOtp, validateVerifyOtp } from "../../middleware/shared/validations.middleware.js";

const router = express.Router();

// base: /api/shared/auth
router.post("/send-verify-otp", validateSendVerifyOtp, sendVerifyOtp);
router.post("/verify-otp", validateVerifyOtp, verifyOtp);

export default router;
