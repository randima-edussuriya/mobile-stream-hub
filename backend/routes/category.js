import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getcategoriesPhone,
} from "../controllers/category.js";

import db from "../config/dbConnection.js";

const router = express.Router();

router.post("/", addCategory);
router.get("/", getCategories);
router.delete("/:id", deleteCategory);
router.get("/phone", getcategoriesPhone);

export default router;
