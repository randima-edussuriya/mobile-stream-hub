import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import {
  addOrderFeedback,
  getItemFeedbacks,
} from "../../controllers/customer/feedback.controller.js";

const router = express.Router();

// base: /api/customer/feedback
// POST / – Add order item feedback
router.post("/order-item", authenticateUser, addOrderFeedback);
// GET /items/:itemId – Get accepted item feedbacks
router.get("/items/:itemId", getItemFeedbacks);

export default router;
