import express from "express";
import {
  updateStatus,
  getCustomer,
  getCustomers,
} from "../controllers/customer.js";

import db from "../config/dbConnection.js";

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.put("/status/:id", updateStatus);

export default router;
