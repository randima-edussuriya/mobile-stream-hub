import express from "express";
import {
  getAllUsers,
  getMeBasicData,
} from "../../controllers/admin/userController.js";
import { userAuth } from "../../middleware/admin/auth.middleware.js";

const router = express.Router();

// base: /api/admin/users
router.get("/me/basic", userAuth, getMeBasicData);
router.get("/", getAllUsers);

export default router;
