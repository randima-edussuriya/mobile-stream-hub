import express from "express";
import {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  updatePayment,
  cancelOrder,
  getCancellations,
  getOrderDistricts,
  getOrderStatuses,
} from "../../controllers/admin/order.controller.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";
import { authorizeRoles } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/orders

// GET / – List orders with filters and pagination
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  getAllOrders,
);
// GET /:orderId – Get a specific order by ID
router.get(
  "/:orderId",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  getOrder,
);
// GET /districts/list – Get list of order districts
router.get(
  "/districts/list",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  getOrderDistricts,
);
// GET /statuses/list – Get list of order statuses
router.get(
  "/statuses/list",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  getOrderStatuses,
);

// GET /cancellations/list – Get list of order cancellations
router.get(
  "/cancellations/list",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  getCancellations,
);
// PUT /:orderId/status – Update order status
router.put(
  "/:orderId/status",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  updateOrderStatus,
);
// PUT /:orderId/payment-status – Update order payment status
router.put(
  "/:orderId/payment-status",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  updatePaymentStatus,
);
// PUT /:orderId/payment – Update order payment amount/method
router.put(
  "/:orderId/payment",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  updatePayment,
);
// PUT /:orderId/cancel – Cancel an order
router.put(
  "/:orderId/cancel",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  cancelOrder,
);

export default router;
