import express from 'express'
import { addCategory, deleteCategory, getCategories } from '../controllers/category.js';

import db from '../db.js';

const router = express.Router();

router.post('/', addCategory);
router.get('/', getCategories);
router.delete('/:id', deleteCategory);

export default router;