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
// GET /me/basic – Get basic profile data for the current customer
router.get("/me/basic", authenticateUser, getMeBasicData);
// GET /me – Get full profile for the current customer
router.get("/me", authenticateUser, getMe);
// PUT /me – Update the current customer's profile
router.put("/me", authenticateUser, validateUpdateMe, updateMe);

export default router;
