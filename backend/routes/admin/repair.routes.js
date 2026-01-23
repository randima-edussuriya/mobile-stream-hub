import express from "express";
import {
  createRepairAcceptance,
  getAllRepairRequests,
  getRepairRequestDetail,
  getAllRepairs,
  getRepairDetail,
  updateRepairRequestStatus,
} from "../../controllers/admin/repair.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/repairs

// GET /records – List all repairs
router.get(
  "/records",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  getAllRepairs,
);

// GET /records/:repairId – Get repair detail by ID
router.get(
  "/records/:repairId",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  getRepairDetail,
);

// GET / – List all customer repair requests
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  getAllRepairRequests,
);

// GET /:requestId – Get repair request details by ID
router.get(
  "/:requestId",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  getRepairRequestDetail,
);

// PUT /:requestId/status – Update repair request status
router.put(
  "/:requestId/status",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  updateRepairRequestStatus,
);

// POST / – Create a repair record for accepted repair request
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  createRepairAcceptance,
);

export default router;
