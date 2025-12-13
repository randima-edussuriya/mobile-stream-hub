import express from "express";
import {
  addItem,
  deleteItem,
  getAllItems,
  getItem,
} from "../../controllers/admin/item.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import {
  validateAddItem,
  validateItemId,
} from "../../middleware/admin/validations.middleware.js";
import uploadImage from "../../middleware/admin/multer.middleware.js";
import multerErrorHandler from "../../middleware/admin/multerErrorHandler.middleware.js";

const router = express.Router();

// base: /api/admin/items
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  uploadImage.single("image"),
  multerErrorHandler,
  validateAddItem,
  addItem
);
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getAllItems
);

router.delete(
  "/:itemId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  validateItemId,
  deleteItem
);

router.get(
  "/:itemId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  validateItemId,
  getItem
);

export default router;
