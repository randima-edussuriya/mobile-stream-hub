import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import {
  addOrderFeedback,
  addRepairFeedback,
  getItemFeedbacks,
} from "../../controllers/customer/feedback.controller.js";

const router = express.Router();

// base: /api/customer/feedback
// POST / – Add order item feedback
router.post("/order-item", authenticateUser, addOrderFeedback);
// POST / – Add repair feedback
router.post("/repair-item", authenticateUser, addRepairFeedback);
// GET /items/:itemId – Get accepted item feedbacks
router.get("/items/:itemId", getItemFeedbacks);

export default router;
