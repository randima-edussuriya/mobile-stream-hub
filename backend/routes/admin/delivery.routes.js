import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import { getAreaAssigned } from "../../controllers/admin/delivery.controller.js";

const router = express.Router();

// base: /api/admin/deliveries
router.get(
  "/area-assigned",
  authenticateUser,
  authorizeRoles(["admin", "deliver person"]),
  getAreaAssigned,
);

export default router;
