import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import {
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
} from "../../controllers/admin/supplier.controller.js";

const router = express.Router();

// base: /api/admin/suppliers
// GET / – List all suppliers
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getAllSuppliers,
);

// GET /:supplierId – Supplier details with items
router.get(
  "/:supplierId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getSupplierById,
);

// PUT /:supplierId – Update supplier
router.put(
  "/:supplierId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  updateSupplier,
);

export default router;
