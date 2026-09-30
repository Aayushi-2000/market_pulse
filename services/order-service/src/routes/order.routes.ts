import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireIdempotencyKey } from '../middleware/idempotency.middleware.js';
import {
    createOrderController,
    getMyOrdersController,
    getOrderByIdController,
} from '../controllers/order.controller.js';

const router = Router();

// All order routes require an authenticated user
router.use(authenticate);

// POST /orders - create a new order
// requireIdempotencyKey ensures duplicate requests are safely handled
router.post('/', requireIdempotencyKey, createOrderController);

// GET /orders - list all orders for the authenticated user
router.get('/', getMyOrdersController);

// GET /orders/:id - get a specific order by ID
router.get('/:id', getOrderByIdController);

export default router;
