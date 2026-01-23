import express from "express";
import { applyCoupon } from "../../controllers/customer/coupon.controller.js";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import { validateApplyCoupon } from "../../middleware/customer/validations.middleware.js";

const router = express.Router();

// base: /api/customer/coupons
// POST /apply – Apply a coupon to the current cart
router.post("/apply", authenticateUser, validateApplyCoupon, applyCoupon);

export default router;
