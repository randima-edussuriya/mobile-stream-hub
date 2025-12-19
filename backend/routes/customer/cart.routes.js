import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import { addToCart } from "../../controllers/customer/cart.controller.js";

const router = express.Router();

// base: /api/customer/cart
router.post("/add", authenticateUser, addToCart);

export default router;
