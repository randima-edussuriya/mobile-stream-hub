import express from "express";
import {
  getAllCoupons,
  getCouponById,
  getCouponUsage,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../controllers/admin/coupon.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/coupons

// GET / – List all coupons
router.get("/", authenticateUser, authorizeRoles(["admin"]), getAllCoupons);

// POST / – Create coupon
router.post("/", authenticateUser, authorizeRoles(["admin"]), createCoupon);

// GET /:couponId – Get coupon details
router.get(
  "/:couponId",
  authenticateUser,
  authorizeRoles(["admin"]),
  getCouponById,
);

// GET /:couponId/usage – Get coupon usage records
router.get(
  "/:couponId/usage",
  authenticateUser,
  authorizeRoles(["admin"]),
  getCouponUsage,
);

// PUT /:couponId – Update coupon
router.put(
  "/:couponId",
  authenticateUser,
  authorizeRoles(["admin"]),
  updateCoupon,
);

// DELETE /:couponId – Delete coupon
router.delete(
  "/:couponId",
  authenticateUser,
  authorizeRoles(["admin"]),
  deleteCoupon,
);

export default router;
