import express from "express";
import {
  getAllUsers,
  getUser,
} from "../../controllers/admin/userController.js";

const router = express.Router();

// base: /api/admin/users
router.get("/", getAllUsers);
router.get("/:id", getUser);

export default router;
