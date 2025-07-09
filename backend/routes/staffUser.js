import express from 'express'
import { getStaffUsers } from '../controllers/staffUser.js';

const router = express.Router();

router.get('/', getStaffUsers)

export default router;