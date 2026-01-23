import express from "express";
import {
  getAllRepairRequests,
  getRepairRequestDetail,
} from "../../controllers/admin/repair.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/repairs

// GET / – List all customer repair requests
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  getAllRepairRequests,
);

// GET /:requestId – Get repair request details by ID
router.get(
  "/:requestId",
  authenticateUser,
  authorizeRoles(["admin", "technician"]),
  getRepairRequestDetail,
);

export default router;
