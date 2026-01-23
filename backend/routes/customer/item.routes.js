import express from "express";
import {
  getCustomerAllItems,
  getItem,
} from "../../controllers/customer/item.controller.js";

const router = express.Router();

// base: /api/customer/items
// GET / – List all items for customers
router.get("/", getCustomerAllItems);
// GET /:itemId – Get item details for customers by ID
router.get("/:itemId", getItem);

export default router;
