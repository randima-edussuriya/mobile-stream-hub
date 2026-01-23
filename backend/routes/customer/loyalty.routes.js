import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import { getLoyaltyInfo } from "../../controllers/customer/loyalty.controllers.js";

const router = express.Router();

// base: /api/customer/loyalty'
// GET / – Get customer's loyalty information
router.get("/", authenticateUser, getLoyaltyInfo);

export default router;
