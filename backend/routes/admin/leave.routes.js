import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import {
  getLeaves,
  getLeaveById,
  updateLeave,
  addLeave,
  updateLeaveStatus,
} from "../../controllers/admin/leave.controller.js";

const router = express.Router();

// base: /api/admin/leaves
// GET / – List all leave requests
router.get("/", authenticateUser, getLeaves);

// POST / – Create leave request
router.post(
  "/",
  authenticateUser,
  authorizeRoles([
    "cashier",
    "deliver person",
    "inventory manager",
    "technician",
  ]),
  addLeave,
);

// GET /:leaveId – Get leave request details
router.get("/:leaveId", authenticateUser, getLeaveById);

// PUT /:leaveId – Update leave request
router.put(
  "/:leaveId",
  authenticateUser,
  authorizeRoles([
    "cashier",
    "deliver person",
    "inventory manager",
    "technician",
  ]),
  updateLeave,
);
// PATCH /:leaveId/status – Update leave request status
router.patch(
  "/:leaveId/status",
  authenticateUser,
  authorizeRoles(["admin"]),
  updateLeaveStatus,
);

export default router;
