import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import { getMeBasicData } from "../../controllers/customer/user.controller.js";

const router = express.Router();

// base: /api/customer/users
router.get("/me/basic", authenticateUser, getMeBasicData);

export default router;
