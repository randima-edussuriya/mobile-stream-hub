import express from "express";
import {
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../../controllers/admin/category.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import { validateCategoryId, validateUpdateCategory } from "../../middleware/admin/validations.middleware.js";

const router = express.Router();

// base: /api/admin/categories
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getCategories
);
router.delete(
  "/:categoryId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  validateCategoryId,
  deleteCategory
);
router.get(
  "/:categoryId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  validateCategoryId,
  getCategory
);

router.put(
  "/:categoryId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  validateUpdateCategory,
  updateCategory
);

export default router;
