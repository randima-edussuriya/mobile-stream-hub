import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router();

// base: api/shared
router.use("/auth", authRoutes);

export default router;
