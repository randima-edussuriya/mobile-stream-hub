import express from "express";
import orderRoutes from "./order.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import categoriesRoutes from "./category.routes.js";
import inquiryRoutes from "./inquiry.routes.js";
import itemRoutes from "./item.routes.js";
import cartRoutes from "./cart.routes.js";

const router = express.Router();

// base: /api/customer
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoriesRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/items", itemRoutes);
router.use("/cart", cartRoutes);

export default router;
