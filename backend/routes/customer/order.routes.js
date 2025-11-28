import express from "express";
import {
  getCustomerOrder,
  getCustomerOrders,
  placeOrder,
} from "../../controllers/customer/order.controller.js";

const router = express.Router();

// base: /api/customer/orders
router.get("/", getCustomerOrders);
router.get("/:id", getCustomerOrder);
router.post("/", placeOrder);

export default router;
