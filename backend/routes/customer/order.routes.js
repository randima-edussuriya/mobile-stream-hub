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

router.get("/delivery-cost", validateGetDeliveryCost, getDeliveryCost);
router.post("/", authenticateUser, validatePlaceOrder, placeOrder);
router.get("/", authenticateUser, getCustomerOrders);
router.get("/:orderId", authenticateUser, getCustomerOrder);
router.put("/:orderId/cancel", authenticateUser, cancelCustomerOrder);

export default router;
