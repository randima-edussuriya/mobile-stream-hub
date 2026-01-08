import express from "express";
import { authenticateUser } from "../../middleware/customer/auth.middleware.js";
import {
  addToCart,
  getCartItems,
  getTotalCartItems,
  removeFromCart,
  updateCart,
} from "../../controllers/customer/cart.controller.js";
import {
  validateAddToCart,
  validateId,
  validateUpdateCart,
} from "../../middleware/customer/validations.middleware.js";

const router = express.Router();

// base: /api/customer/cart
router.post("/add", authenticateUser, validateAddToCart, addToCart);
router.get("/", authenticateUser, getCartItems);
router.delete("/:cartItemId", authenticateUser, validateId, removeFromCart);
router.put("/", authenticateUser, validateUpdateCart, updateCart);
router.get("/total-items", authenticateUser, getTotalCartItems);

export default router;
