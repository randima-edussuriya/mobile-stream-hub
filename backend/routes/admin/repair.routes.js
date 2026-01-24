import express from "express";
import {
  createRepairAcceptance,
  getAllRepairRequests,
  getRepairRequestDetail,
  getAllRepairs,
  getRepairDetail,
  updateRepairStatus,
  updateRepairDetails,
  getActiveTechnicians,
  updateRepairTechnician,
  cancelRepair,
  rejectRepairRequest,
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

// PUT /records/:repairId – Update repair details (total_cost, identified_issue, identified_device)
router.put(
  "/records/:repairId",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  updateRepairDetails,
);

// PUT /records/:repairId/status – Update repair status
router.put(
  "/records/:repairId/status",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  updateRepairStatus,
);

// PUT /records/:repairId/cancel – Cancel repair
router.put(
  "/records/:repairId/cancel",
  authenticateUser,
  authorizeRoles(["admin"]),
  cancelRepair,
);

// PUT /:requestId/reject – Reject repair request
router.put(
  "/:requestId/reject",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  rejectRepairRequest,
);

// GET /technicians – Get all active technicians
router.get(
  "/technicians",
  authenticateUser,
  authorizeRoles(["admin"]),
  getActiveTechnicians,
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

// PUT /:requestId/technician – Update technician for repair request
router.put(
  "/:requestId/technician",
  authenticateUser,
  authorizeRoles(["admin"]),
  updateRepairTechnician,
);

// POST / – Create a repair record for accepted repair request
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  createRepairAcceptance,
);

export default router;
