import express from "express";
import {
  getCustomerOrder,
  getCustomerOrders,
  placeOrder,
  getDeliveryCost,
} from "../../controllers/customer/order.controller.js";
import { validateGetDeliveryCost } from "../../middleware/customer/validations.middleware.js";

const router = express.Router();

// base: /api/customer/orders

router.get("/", getCustomerOrders);
router.get("/delivery-cost", validateGetDeliveryCost, getDeliveryCost);
router.get("/:id", getCustomerOrder);
router.post("/", placeOrder);

export default router;
