import express from "express";
import adminRoutes from "./admin/index.js";
import customerRoutes from "./customer/index.js";
import sharedRoutes from "./shared/index.js";

const router = express.Router();

// base: /api
router.use("/admin", adminRoutes);
router.use("/customer", customerRoutes);
router.use("/shared", sharedRoutes);

export default router;