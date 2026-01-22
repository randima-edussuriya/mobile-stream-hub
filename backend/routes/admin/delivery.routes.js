import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import {
  getAreaAssigned,
  getDeliveryAreas,
  updateDeliveryAreaCost,
  getDeliverPersons,
  updateStaffDeliveryArea,
} from "../../controllers/admin/delivery.controller.js";

const router = express.Router();

// base: /api/admin/deliveries
router.get(
  "/area-assigned",
  authenticateUser,
  authorizeRoles(["admin", "deliver person"]),
  getAreaAssigned,
);

// Get all delivery areas with staff details
router.get(
  "/areas",
  authenticateUser,
  authorizeRoles(["admin"]),
  getDeliveryAreas,
);

// Update delivery area cost
router.put(
  "/areas/:areaId",
  authenticateUser,
  authorizeRoles(["admin"]),
  updateDeliveryAreaCost,
);

// Get all deliver person staff
router.get(
  "/staff",
  authenticateUser,
  authorizeRoles(["admin"]),
  getDeliverPersons,
);

// Update staff's assigned delivery area
router.put(
  "/staff/:staffId/area",
  authenticateUser,
  authorizeRoles(["admin"]),
  updateStaffDeliveryArea,
);

export default router;
