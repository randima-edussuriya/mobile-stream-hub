import express from "express";
import orderRoutes from "./order.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import categoriesRoutes from "./category.routes.js";

const router = express.Router();

// base: /api/customer
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoriesRoutes);

export default router;
