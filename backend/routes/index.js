import express from "express";
import adminRoutes from "./admin/index.js";
import customerRoutes from "./customer/index.js";

const router = express.Router();

// base: /api
router.use("/admin", adminRoutes);
router.use("/customer", customerRoutes);

export default router;
