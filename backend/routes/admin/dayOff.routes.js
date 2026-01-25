import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middleware/admin/auth.middleware.js";
import {
  getDayOffs,
  getDayOffById,
  updateDayOff,
  addDayOff,
  deleteDayOff,
} from "../../controllers/admin/dayOff.controller.js";

const router = express.Router();

// base: /api/admin/day-offs
// GET / – List all day offs
router.get("/", authenticateUser, getDayOffs);

// POST / – Create day off
router.post("/", authenticateUser, authorizeRoles(["admin"]), addDayOff);

// GET /:dayOffId – Get day off details
router.get(
  "/:dayOffId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager", "cashier", "technician"]),
  getDayOffById,
);

// PUT /:dayOffId – Update day off
router.put(
  "/:dayOffId",
  authenticateUser,
  authorizeRoles(["admin", "inventory manager"]),
  updateDayOff,
);

// DELETE /:dayOffId – Delete day off
router.delete(
  "/:dayOffId",
  authenticateUser,
  authorizeRoles(["admin"]),
  deleteDayOff,
);

export default router;
