import express from "express";
import {
  getDashboardStats,
  getOrderDistrictDistribution,
  getOrderStatusDistribution,
  getPaymentMethodDistribution,
  getRevenueByCategory,
  getRevenueByOrder,
} from "../../controllers/admin/dashboard.controller.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/dashboard
router.get("/stats", authenticateUser, getDashboardStats);
router.get("/order-status", authenticateUser, getOrderStatusDistribution);
router.get("/payment-methods", authenticateUser, getPaymentMethodDistribution);
router.get("/order-district", authenticateUser, getOrderDistrictDistribution);
router.get("/revenue-by-order", authenticateUser, getRevenueByOrder);
router.get("/revenue-by-category", authenticateUser, getRevenueByCategory);

export default router;
