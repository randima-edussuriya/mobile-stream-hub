import express from "express";
import {
  checkEmailExist,
  login,
  register,
  sendVerifyOtp,
} from "../../controllers/admin/authController.js";
import { validateEmail } from "../../middleware/validations.js";

const router = express.Router();

// base: /api/admin/auth
router.post("/check-email-exist", validateEmail, checkEmailExist);
router.post("/send-verify-otp", validateEmail, sendVerifyOtp);
router.post("/register", register);
router.post("/login", login);

export default router;
