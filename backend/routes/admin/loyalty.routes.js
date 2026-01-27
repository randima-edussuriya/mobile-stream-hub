import express from "express";
import {
  getLoyaltySettings,
  updateLoyaltySetting,
} from "../../controllers/admin/loyalty.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/loyalty-settings
// GET / – List all loyalty settings
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier"]),
  getLoyaltySettings,
);

// PUT / – Update a loyalty setting
router.put(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  updateLoyaltySetting,
);

export default router;
