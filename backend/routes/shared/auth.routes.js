import express from "express";
import { sendVerifyOtp } from "../../controllers/shared/auth.controller.js";

const router = express.Router();

// base: /api/shared/auth
router.post("/send-verify-otp", sendVerifyOtp);

export default router;
