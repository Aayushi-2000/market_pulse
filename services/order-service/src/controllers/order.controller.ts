import { Request, Response, NextFunction } from 'express';
import { createNewOrder, getOrdersByUser, getOrderById } from '../services/order.service.js';
import { createOrderSchema } from '../validators/order.validator.js';
import { AppError } from '../utils/app-error.js';

export const createOrderController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parsed = createOrderSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.issues[0].message, 400);
        }

        const userId = req.user?.id;
        if (!userId) throw new AppError('Unauthorized', 401);

        // Idempotency-Key header from client prevents duplicate orders on retry
        const rawKey = req.headers['idempotency-key'];
        const idempotencyKey = Array.isArray(rawKey) ? rawKey[0] : rawKey;

        const order = await createNewOrder({
            userId,
            items: parsed.data.items,
            idempotencyKey,
        });

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order,
        });
    } catch (err) {
        next(err);
    }
};

export const getMyOrdersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        if (!userId) throw new AppError('Unauthorized', 401);

        const orders = await getOrdersByUser(userId);

        return res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

export const getOrderByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        if (!userId) throw new AppError('Unauthorized', 401);

        const order = await getOrderById(req.params.id as string, userId);

        return res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};
