import express from "express";
import {
  getCustomerAllItems,
  getItem,
} from "../../controllers/customer/item.controller.js";

const router = express.Router();

// base: /api/customer/items
router.get("/", getCustomerAllItems);
router.get("/:itemId", getItem);

export default router;
