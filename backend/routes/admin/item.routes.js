import express from "express";
import {
  addItem,
  getAllItems,
  getItem,
} from "../../controllers/admin/item.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import { validateAddItem } from "../../middleware/admin/validations.middleware.js";
import uploadImage from "../../middleware/admin/multer.middleware.js";
import multerErrorHandler from "../../middleware/admin/multerErrorHandler.middleware.js";

const router = express.Router();

// base: /api/admin/items
router.get("/", getAllItems);
router.get("/:id", getItem);
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  uploadImage.single("image"),
  multerErrorHandler,
  validateAddItem,
  addItem
);

export default router;
