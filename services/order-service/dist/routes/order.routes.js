import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireIdempotencyKey } from '../middleware/idempotency.middleware.js';
import { createOrderController, getMyOrdersController, getOrderByIdController, } from '../controllers/order.controller.js';
const router = Router();
router.use(authenticate);

router.post('/', requireIdempotencyKey, createOrderController);
router.get('/', getMyOrdersController);
router.get('/:id', getOrderByIdController);
export default router;
