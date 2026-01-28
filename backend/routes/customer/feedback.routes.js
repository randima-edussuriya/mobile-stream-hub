import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import { addOrderFeedback } from "../../controllers/customer/feedback.controller.js";

const router = express.Router();

// base: /api/customer/feedback
// POST / – Add order item feedback
router.post("/order-item", authenticateUser, addOrderFeedback);

export default router;
