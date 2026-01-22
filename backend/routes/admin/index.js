import express from "express";
import userRoutes from "./staffUser.routes.js";
import itemRoutes from "./item.routes.js";
import orderRoutes from "./order.routes.js";
import authRoutes from "./auth.routes.js";
import customerRoutes from "./customer.routes.js";
import categoriesRoutes from "./category.routes.js";
import supplierRoutes from "./supplier.routes.js";
import couponRoutes from "./coupon.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import deliveryRoutes from "./delivery.routes.js";

const router = express.Router();

// base: api/admin
router.use("/staff-users", userRoutes);
router.use("/items", itemRoutes);
router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);
router.use("/categories", categoriesRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/coupons", couponRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/deliveries", deliveryRoutes);

export default router;
