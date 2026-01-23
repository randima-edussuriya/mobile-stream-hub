import express from "express";
import {
  getAllCustomers,
  updateCustomerStatus,
} from "../../controllers/admin/customer.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import { validateUpdateCustomerStatus } from "../../middleware/admin/validations.middleware.js";

const router = express.Router();

// bass: api/admin/customers
// GET / – List all customers
router.get("/", authenticateUser, authorizeRoles(["admin"]), getAllCustomers);
// PUT /:customerId/status – Update a customer's status (activate/deactivate)
router.put(
  "/:customerId/status",
  authenticateUser,
  authorizeRoles(["admin"]),
  validateUpdateCustomerStatus,
  updateCustomerStatus,
);

export default router;
