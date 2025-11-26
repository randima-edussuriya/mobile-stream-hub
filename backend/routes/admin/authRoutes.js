import express from "express";
import { login, register } from "../../controllers/admin/authController.js";
import { validateRegister } from "../../middleware/admin/validations.middleware.js";
import { isVerifiedOtp } from "../../middleware/shared/auth.middleware.js";

const router = express.Router();

// base: /api/admin/auth
router.post("/register", validateRegister, isVerifiedOtp, register);
router.post("/login", login);

export default router;
