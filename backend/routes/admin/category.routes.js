import express from "express";
import { getCategories } from "../../controllers/admin/category.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/customer/categories
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getCategories
);

export default router;
