import express from "express";
import { getStaffTypes } from "../controllers/staffType.js";

import db from "../config/dbConnection.js";

const router = express.Router();

router.get("/", getStaffTypes);

export default router;
