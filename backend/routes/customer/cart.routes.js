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
// POST /add – Add an item to the cart
router.post("/add", authenticateUser, validateAddToCart, addToCart);
// GET / – Get all items in the customer's cart
router.get("/", authenticateUser, getCartItems);
// DELETE /:cartItemId – Remove a cart item by ID
router.delete("/:cartItemId", authenticateUser, validateId, removeFromCart);
// PUT / – Update cart item quantities
router.put("/", authenticateUser, validateUpdateCart, updateCart);
// GET /total-items – Get total count of items in cart
router.get("/total-items", authenticateUser, getTotalCartItems);

export default router;
