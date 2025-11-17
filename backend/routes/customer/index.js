import express from "express";
import orderRoutes from "./orderRoutes.js";

const router = express.Router();

// base: /api/customer
router.use("/orders", orderRoutes);

export default router;
