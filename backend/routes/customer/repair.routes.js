import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import {
  getTechnicians,
  checkTechnicianAvailability,
  createRepairRequest,
} from "../../controllers/customer/repair.controller.js";

const router = express.Router();

// base: /api/customer/repair

// Get all active technicians
router.get("/technicians", authenticateUser, getTechnicians);

// Check technician availability
router.get("/availability", authenticateUser, checkTechnicianAvailability);

// Create repair request
router.post("/requests", authenticateUser, createRepairRequest);

export default router;
