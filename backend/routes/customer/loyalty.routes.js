import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import {
  getLoyaltyInfo,
  getMyLoyaltyProgram,
} from "../../controllers/customer/loyalty.controllers.js";

const router = express.Router();

// base: /api/customer/loyalty'
// GET / – Get customer's loyalty information
router.get("/", authenticateUser, getLoyaltyInfo);

// GET /my-program – Get customer's loyalty program data
router.get("/my-program", authenticateUser, getMyLoyaltyProgram);

export default router;
