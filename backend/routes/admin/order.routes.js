import express from "express";
import {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  updatePaymentDate,
} from "../../controllers/admin/order.controller.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";
import { authorizeRoles } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/orders
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  getAllOrders,
);
router.get(
  "/:orderId",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  getOrder,
);
router.put(
  "/:orderId/status",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  updateOrderStatus,
);
router.put(
  "/:orderId/payment-status",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  updatePaymentStatus,
);
router.put(
  "/:orderId/payment-date",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  updatePaymentDate,
);

export default router;
