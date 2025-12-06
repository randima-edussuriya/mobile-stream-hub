import express from "express";
import userRoutes from "./staffUser.routes.js";
import itemRoutes from "./item.routes.js";
import orderRoutes from "./order.routes.js";
import authRoutes from "./auth.routes.js";
import customerRoutes from "./customer.routes.js";

const router = express.Router();

// base: api/admin
router.use("/users", userRoutes);
router.use("/items", itemRoutes);
router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);

export default router;
