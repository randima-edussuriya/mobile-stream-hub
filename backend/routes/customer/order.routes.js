import express from "express";
import {
  getCustomerOrder,
  getCustomerOrders,
  placeOrder,
  getDeliveryCost,
  cancelCustomerOrder,
} from "../../controllers/customer/order.controller.js";
import {
  validateGetDeliveryCost,
  validatePlaceOrder,
} from "../../middleware/customer/validations.middleware.js";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";

const router = express.Router();

// base: /api/customer/orders

// GET /delivery-cost – Get estimated delivery cost for an order
router.get("/delivery-cost", validateGetDeliveryCost, getDeliveryCost);
// POST / – Place a new order
router.post("/", authenticateUser, validatePlaceOrder, placeOrder);
// GET / – Get list of customer's orders
router.get("/", authenticateUser, getCustomerOrders);
// GET /:orderId – Get a specific customer order by ID
router.get("/:orderId", authenticateUser, getCustomerOrder);
// PUT /:orderId/cancel – Cancel a customer's order
router.put("/:orderId/cancel", authenticateUser, cancelCustomerOrder);

export default router;
