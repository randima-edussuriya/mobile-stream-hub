import express from "express";
import {
  addItem,
  deleteItem,
  getAllItems,
  getItem,
  updateItem,
} from "../../controllers/admin/item.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import {
  validateAddItem,
  validateItemId,
  validateUpdateItem,
} from "../../middleware/admin/validations.middleware.js";
import uploadImage from "../../middleware/admin/multer.middleware.js";
import multerErrorHandler from "../../middleware/admin/multerErrorHandler.middleware.js";

const router = express.Router();

// base: /api/admin/items
// POST / – Create a new item (with image upload)
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  uploadImage.single("image"),
  multerErrorHandler,
  validateAddItem,
  addItem,
);
// PUT /:itemId – Update an item's details (with optional image upload)
router.put(
  "/:itemId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  uploadImage.single("image"),
  multerErrorHandler,
  validateUpdateItem,
  updateItem,
);
// GET / – List all items
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getAllItems,
);

// DELETE /:itemId – Delete an item by ID
router.delete(
  "/:itemId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  validateItemId,
  deleteItem,
);

// GET /:itemId – Get item details by ID
router.get(
  "/:itemId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  validateItemId,
  getItem,
);

export default router;
