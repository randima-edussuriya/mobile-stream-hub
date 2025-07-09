import express from 'express'
import { login, logout, register } from '../../controllers/auth/adminAuth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/regiser', register);

export default router;