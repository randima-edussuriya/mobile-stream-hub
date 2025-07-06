import express from 'express'
import { deactivateCustomer, getCustomer, getCustomers } from '../../controllers/admin/customer.js';

import db from '../../db.js';

const router = express.Router();

router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', deactivateCustomer);

export default router;