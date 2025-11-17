import express from "express";
import { login, register } from "../../controllers/admin/authController.js";

const router = express.Router();

// base: /api/admin/auth
router.post("/register", register);
router.post("/login", login);

export default router;
