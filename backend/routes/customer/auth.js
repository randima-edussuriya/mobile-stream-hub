import express from 'express'
import { login, logout, signup, test } from '../../controllers/customer/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('logout', logout);
router.get('/test', test);

export default router;