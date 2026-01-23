import express from "express";
import {
  getAllUsers,
  getMe,
  getMeBasicData,
  getStaffTypes,
  getStaffUser,
  updateStaffUser,
  updateUserStatus,
} from "../../controllers/admin/staffUser.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import {
  validateStaffUserId,
  validateUpdateStaffUser,
  validateUpdateUserStatus,
} from "../../middleware/admin/validations.middleware.js";

const router = express.Router();

// base: /api/admin/staff-users
// GET /me/basic – Get current staff user's basic data
router.get("/me/basic", authenticateUser, getMeBasicData);
// GET /me – Get current staff user's profile
router.get("/me", authenticateUser, getMe);
// GET / – List all staff users
router.get("/", authenticateUser, authorizeRoles(["admin"]), getAllUsers);
// GET /staff-types – Get list of staff types
router.get(
  "/staff-types",
  authenticateUser,
  authorizeRoles(["admin"]),
  getStaffTypes,
);
// GET /:staffId – Get staff user details by ID
router.get(
  "/:staffId",
  authenticateUser,
  authorizeRoles(["admin"]),
  validateStaffUserId,
  getStaffUser,
);

router.get(
  "/staff-types",
  authenticateUser,
  authorizeRoles(["admin"]),
  getStaffTypes,
);
// GET /:staffId – Get staff user details by ID
router.get(
  "/:staffId",
  authenticateUser,
  authorizeRoles(["admin"]),
  validateStaffUserId,
  getStaffUser,
);
// PUT /:staffId/status – Update staff user's status (activate/deactivate)
router.put(
  "/:staffId/status",
  authenticateUser,
  authorizeRoles(["admin"]),
  validateUpdateUserStatus,
  updateUserStatus,
);

// PUT /:staffId – Update staff user's profile
router.put(
  "/:staffId",
  authenticateUser,
  authorizeRoles(["admin"]),
  validateUpdateStaffUser,
  updateStaffUser,
);

export default router;
