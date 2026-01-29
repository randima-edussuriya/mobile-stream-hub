import express from "express";
import {
  getAllItemFeedbacks,
  getItemFeedback,
  updateFeedbackStatus,
} from "../../controllers/admin/feedback.controller.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";
import { authorizeRoles } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/feedbacks

// GET / – Get all item feedbacks with optional status filter
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  getAllItemFeedbacks,
);

// GET /:feedbackId – Get a specific feedback by ID
router.get(
  "/:feedbackId",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  getItemFeedback,
);

// PUT /:feedbackId/status – Update feedback status
router.put(
  "/:feedbackId/status",
  authenticateUser,
  authorizeRoles(["admin", "cashier"]),
  updateFeedbackStatus,
);

export default router;
