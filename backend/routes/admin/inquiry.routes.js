import express from "express";
import {
  getAllInquiries,
  replyToInquiry,
} from "../../controllers/admin/inquiry.controller.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";
import { authorizeRoles } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/inquiries

// GET / – Get all customer inquiries
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  getAllInquiries,
);

// PUT /:inquiryId/reply – Reply to an inquiry
router.put(
  "/:inquiryId/reply",
  authenticateUser,
  authorizeRoles(["admin"]),
  replyToInquiry,
);

export default router;
