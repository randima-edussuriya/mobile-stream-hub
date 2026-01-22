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

router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  getAllOrders,
);
router.get(
  "/:orderId",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  getOrder,
);
router.get(
  "/districts/list",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  getOrderDistricts,
);
router.get(
  "/statuses/list",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  getOrderStatuses,
);

router.get(
  "/cancellations/list",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  getCancellations,
);
router.put(
  "/:orderId/status",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  updateOrderStatus,
);
router.put(
  "/:orderId/payment-status",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  updatePaymentStatus,
);
router.put(
  "/:orderId/payment",
  authenticateUser,
  authorizeRoles(["admin", "cashier", "deliver person"]),
  updatePayment,
);
router.put(
  "/:orderId/cancel",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  cancelOrder,
);

export default router;
