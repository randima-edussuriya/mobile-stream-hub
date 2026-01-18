import express from "express";
import {
  getCustomerOrder,
  getCustomerOrders,
  placeOrder,
  getDeliveryCost,
} from "../../controllers/customer/order.controller.js";
import {
  validateGetDeliveryCost,
  validatePlaceOrder,
} from "../../middleware/customer/validations.middleware.js";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";

const router = express.Router();

// base: /api/customer/orders

router.get("/", getCustomerOrders);
router.get("/delivery-cost", validateGetDeliveryCost, getDeliveryCost);
router.get("/:id", getCustomerOrder);
router.post("/", authenticateUser, validatePlaceOrder, placeOrder);

export default router;
