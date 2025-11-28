import express from "express";
import {
  getAllOrders,
  getOrder,
  updateOrderStatus,
} from "../../controllers/admin/order.controller.js";

const router = express.Router();

// base: /api/admin/orders
router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.put("/:id/status", updateOrderStatus);

export default router;
