import express from "express";
import {
  addItem,
  getAllItems,
  getItem,
} from "../../controllers/admin/item.controler.js";

const router = express.Router();

// base: /api/admin/orders
router.get("/", getAllItems);
router.get("/:id", getItem);
router.post("/", addItem);

export default router;
