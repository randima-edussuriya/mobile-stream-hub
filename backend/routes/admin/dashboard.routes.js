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
// GET /stats – Get dashboard KPI statistics
router.get("/stats", authenticateUser, getDashboardStats);
// GET /order-status – Get order status distribution
router.get("/order-status", authenticateUser, getOrderStatusDistribution);
// GET /payment-methods – Get payment method distribution
router.get("/payment-methods", authenticateUser, getPaymentMethodDistribution);
// GET /order-district – Get district-wise order distribution
router.get("/order-district", authenticateUser, getOrderDistrictDistribution);
// GET /revenue-by-order – Get revenue aggregated by order
router.get("/revenue-by-order", authenticateUser, getRevenueByOrder);
// GET /revenue-by-category – Get revenue aggregated by category
router.get("/revenue-by-category", authenticateUser, getRevenueByCategory);

export default router;
