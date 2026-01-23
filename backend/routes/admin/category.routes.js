import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../../controllers/admin/category.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import {
  validateAddCategory,
  validateCategoryId,
  validateUpdateCategory,
} from "../../middleware/admin/validations.middleware.js";

const router = express.Router();

// base: /api/admin/categories
// GET / – List all categories
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getCategories,
);
// DELETE /:categoryId – Delete a category by ID
router.delete(
  "/:categoryId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  validateCategoryId,
  deleteCategory,
);
// GET /:categoryId – Get category details by ID
router.get(
  "/:categoryId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  validateCategoryId,
  getCategory,
);

// PUT /:categoryId – Update category
router.put(
  "/:categoryId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  validateUpdateCategory,
  updateCategory,
);

// POST / – Create a new category
router.post(
  "",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  validateAddCategory,
  addCategory,
);

export default router;
