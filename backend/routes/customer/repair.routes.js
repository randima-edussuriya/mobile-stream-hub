import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import {
  getMyRepairRequests,
  getRepairRequestDetail,
  getTechnicians,
  checkTechnicianAvailability,
  createRepairRequest,
  getMyRepairs,
  getRepairDetail,
} from "../../controllers/customer/repair.controller.js";

const router = express.Router();

// base: /api/customer/repair

// Get my repair requests
router.get("/my-requests", authenticateUser, getMyRepairRequests);

// Get repair request details by ID
router.get("/requests/:requestId", authenticateUser, getRepairRequestDetail);

// Get my repairs
router.get("/my-repairs", authenticateUser, getMyRepairs);

// Get repair details by ID
router.get("/repairs/:repairId", authenticateUser, getRepairDetail);

// Get all active technicians
router.get("/technicians", authenticateUser, getTechnicians);

// Check technician availability
router.get("/availability", authenticateUser, checkTechnicianAvailability);

// Create repair request
router.post("/requests", authenticateUser, createRepairRequest);

export default router;
