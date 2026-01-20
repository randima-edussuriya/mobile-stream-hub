import express from "express";
import { getDashboardStats } from "../../controllers/admin/dashboard.controller.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/dashboard
router.get(
  "/stats",
  authenticateUser,
  getDashboardStats,
);

export default router;
