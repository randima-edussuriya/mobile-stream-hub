import express from "express";
import {
  getDashboardStats,
  getOrderStatusDistribution,
  getPaymentMethodDistribution,
  getRevenueByOrder,
} from "../../controllers/admin/dashboard.controller.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/dashboard
router.get("/stats", authenticateUser, getDashboardStats);
router.get("/order-status", authenticateUser, getOrderStatusDistribution);
router.get("/payment-methods", authenticateUser, getPaymentMethodDistribution);
router.get("/revenue-by-order", authenticateUser, getRevenueByOrder);

export default router;
