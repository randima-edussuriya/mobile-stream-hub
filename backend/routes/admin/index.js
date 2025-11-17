import express from "express";
import userRoutes from "./userRoutes.js";
import itemRoutes from "./itemRoutes.js";
import orderRoutes from "./orderRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

// base: api/admin
router.use("/users", userRoutes);
router.use("/items", itemRoutes);
router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);

export default router;
