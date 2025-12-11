import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import {
  getMe,
  getMeBasicData,
  updateMe,
} from "../../controllers/customer/user.controller.js";
import { validateUpdateMe } from "../../middleware/customer/validations.middleware.js";

const router = express.Router();

// base: /api/customer/users
router.get("/me/basic", authenticateUser, getMeBasicData);
router.get("/me", authenticateUser, getMe);
router.put("/me", authenticateUser, validateUpdateMe, updateMe);

export default router;
