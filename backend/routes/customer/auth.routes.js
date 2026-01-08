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
router.post("/register", validateRegister, isVerifiedOtp, register);
router.post("/login", validateLogin, login);
router.get("/is-authenticated", authenticateUser, isAuthenticated);
router.post("/logout", logout);
router.put(
  "/reset-password",
  validateResetPassword,
  isVerifiedOtp,
  resetPassword
);

export default router;
