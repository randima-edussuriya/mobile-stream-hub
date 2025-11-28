import express from "express";
import {
  getAllUsers,
  getMeBasicData,
  updateUserStatus,
} from "../../controllers/admin/user.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import { validateUpdateUserStatus } from "../../middleware/admin/validations.middleware.js";

const router = express.Router();

// base: /api/admin/users
router.get("/me/basic", authenticateUser, getMeBasicData);
router.get("/", authenticateUser, authorizeRoles(["admin"]), getAllUsers);
router.put(
  "/:staffId/status",
  authenticateUser,
  authorizeRoles(["admin"]),
  validateUpdateUserStatus,
  updateUserStatus
);

export default router;
