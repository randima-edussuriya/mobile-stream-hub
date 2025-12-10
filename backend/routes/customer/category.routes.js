import express from "express";
import { getCategories } from "../../controllers/customer/category.controller.js";

const router = express.Router();

// base: /api/customer/categories
router.get("/", getCategories);

export default router;
