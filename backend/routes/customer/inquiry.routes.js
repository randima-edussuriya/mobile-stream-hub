import express from "express";
import { validateSubmitInquiry } from "../../middleware/customer/validations.middleware.js";
import { submitInquiry } from "../../controllers/customer/inquiry.controller.js";

const router = express.Router();

// base: /api/customer/inquiries
router.post("/", validateSubmitInquiry, submitInquiry);

export default router;
