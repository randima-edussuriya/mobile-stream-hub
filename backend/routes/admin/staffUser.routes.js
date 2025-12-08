import express from "express";
import {
  getAllUsers,
  getMeBasicData,
  getStaffTypes,
  updateUserStatus,
} from "../../controllers/admin/staffUser.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import { validateUpdateUserStatus } from "../../middleware/admin/validations.middleware.js";

const router = express.Router();

// base: /api/admin/staff-users
router.get("/me/basic", authenticateUser, getMeBasicData);
router.get("/", authenticateUser, authorizeRoles(["admin"]), getAllUsers);
router.put(
  "/:staffId/status",
  authenticateUser,
  authorizeRoles(["admin"]),
  validateUpdateUserStatus,
  updateUserStatus
);
router.get(
  "/staff-types",
  authenticateUser,
  authorizeRoles(["admin"]),
  getStaffTypes
);

export default router;
