import express from "express";
import { createCoupon } from "../../controllers/admin/coupon.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import { validateCreateCoupon } from "../../middleware/admin/validations.middleware.js";

const router = express.Router();

// base: api/admin/coupons
router.post(
  "/create",
  authenticateUser,
  authorizeRoles(["admin"]),
  validateCreateCoupon,
  createCoupon
);

export default router;
