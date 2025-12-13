import express from "express";
import userRoutes from "./staffUser.routes.js";
import itemRoutes from "./item.routes.js";
import orderRoutes from "./order.routes.js";
import authRoutes from "./auth.routes.js";
import customerRoutes from "./customer.routes.js";
import categoriesRoutes from "./category.routes.js";
import supplierRoutes from "./supplier.routes.js";

const router = express.Router();

// base: api/admin
router.use("/staff-users", userRoutes);
router.use("/items", itemRoutes);
router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);
router.use("/categories", categoriesRoutes);
router.use("/suppliers", supplierRoutes);

export default router;
