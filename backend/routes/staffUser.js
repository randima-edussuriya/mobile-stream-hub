import express from "express";
import { getStaffUsers, updateStatus } from "../controllers/staffUser.js";

const router = express.Router();

router.get("/", getStaffUsers);
router.put("/status/:id", updateStatus);

export default router;
