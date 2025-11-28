import express from "express";
import {
  getAllUsers,
  getMeBasicData,
} from "../../controllers/admin/user.controller.js";
import { authenticateUser } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/users
router.get("/me/basic", authenticateUser, getMeBasicData);
router.get("/", authenticateUser, getAllUsers);

export default router;
