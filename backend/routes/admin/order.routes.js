import express from "express";
import {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  updatePayment,
  cancelOrder,
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
  "/:orderId/payment",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  updatePayment,
);
router.put(
  "/:orderId/cancel",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  cancelOrder,
);

export default router;
