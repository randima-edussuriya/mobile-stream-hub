import express from "express";
import {
  getLoyaltySettings,
  updateLoyaltySetting,
  getLoyaltyPrograms,
} from "../../controllers/admin/loyalty.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/loyalty
// GET / – List all loyalty settings
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  getLoyaltySettings,
);

// GET /programs – List all loyalty programs
router.get(
  "/programs",
  authenticateUser,
  authorizeRoles(["admin"]),
  getLoyaltyPrograms,
);

// PUT / – Update a loyalty setting
router.put(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  updateLoyaltySetting,
);

export default router;
