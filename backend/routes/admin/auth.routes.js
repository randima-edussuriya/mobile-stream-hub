import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
} from "../../controllers/admin/auth.controller.js";
import { validateRegister } from "../../middleware/admin/validations.middleware.js";
import { isVerifiedOtp } from "../../middleware/shared/auth.middleware.js";
import { validateLogin } from "../../middleware/shared/validations.middleware.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/auth
// POST /register – Register a new admin/staff user
router.post("/register", validateRegister, isVerifiedOtp, register);
// POST /login – Admin/staff login
router.post("/login", validateLogin, login);
// GET /is-authenticated – Check admin/staff authentication status
router.get("/is-authenticated", authenticateUser, isAuthenticated);
// POST /logout – Admin/staff logout
router.post("/logout", logout);

export default router;
