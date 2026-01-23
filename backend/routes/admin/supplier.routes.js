import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import { getAllSuppliers } from "../../controllers/admin/supplier.controller.js";

const router = express.Router();

// base: /api/admin/suppliers
// GET / – List all suppliers
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getAllSuppliers,
);

export default router;
