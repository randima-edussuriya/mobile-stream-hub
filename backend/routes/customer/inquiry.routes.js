import express from "express";
import { validateSubmitInquiry } from "../../middleware/customer/validations.middleware.js";
import {
  submitInquiry,
  getMyInquiries,
} from "../../controllers/customer/inquiry.controller.js";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";

const router = express.Router();

// base: /api/customer/inquiries
// POST / – Submit a customer inquiry
router.post("/", validateSubmitInquiry, submitInquiry);
// GET / – Get all inquiries for logged-in customer
router.get("/", authenticateUser, getMyInquiries);

export default router;
