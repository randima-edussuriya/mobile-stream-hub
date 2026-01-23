import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
} from "../../controllers/customer/auth.controller.js";
import {
  validateRegister,
  validateResetPassword,
} from "../../middleware/customer/validations.middleware.js";
import { isVerifiedOtp } from "../../middleware/shared/auth.middleware.js";
import { validateLogin } from "../../middleware/shared/validations.middleware.js";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";

const router = express.Router();

// base: /api/customer/auth
// POST /register – Register a new customer
router.post("/register", validateRegister, isVerifiedOtp, register);
// POST /login – Customer login
router.post("/login", validateLogin, login);
// GET /is-authenticated – Check customer authentication status
router.get("/is-authenticated", authenticateUser, isAuthenticated);
// POST /logout – Customer logout
router.post("/logout", logout);
// PUT /reset-password – Reset customer password after OTP verification
router.put(
  "/reset-password",
  validateResetPassword,
  isVerifiedOtp,
  resetPassword,
);

export default router;
