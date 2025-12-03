import express from "express";
import orderRoutes from "./order.routes.js";
import authRoutes from "./auth.routes.js";

const router = express.Router();

// base: /api/customer
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);

export default router;
