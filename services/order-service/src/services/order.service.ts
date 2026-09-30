import { AppError } from '../utils/app-error.js';
import { publishEvent } from '../messaging/publisher.js';
import {
    createOrder,
    findOrdersByUser,
    findOrderById,
    findOrderByIdempotencyKey,
} from '../repositories/order.repository.js';
import { type IOrderItem } from '../types/order.types.js';
import { acquireLock, releaseLock } from '../utils/redis-lock.js';

export const createNewOrder = async ({
    userId,
    items,
    idempotencyKey,
}: {
    userId: string;
    items: IOrderItem[];
    idempotencyKey?: string;
}) => {
    // ─── Idempotency check ──────────────────────────────────────────────────
    if (idempotencyKey) {
        const existing = await findOrderByIdempotencyKey(idempotencyKey);
        if (existing) {
            // Same request seen before — return the existing order without
            // creating a duplicate or publishing another event
            return existing;
        }
    }

    // ─── Distributed Lock ────────────────────────────────────────────────────
    // Prevents the same user from creating two orders simultaneously
    const lockKey = `lock:order:create:${userId}`;
    const lockVal = await acquireLock(lockKey, 10);

    if (!lockVal) {
        throw new AppError('Another order is already being processed. Please wait.', 409);
    }

    try {
        // ─── Calculate total ───────────────────────────────────────────────
        const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // ─── Persist order ─────────────────────────────────────────────────
        const order = await createOrder({
            userId,
            items,
            totalAmount,
            idempotencyKey,
        });

        // ─── Publish event to RabbitMQ ─────────────────────────────────────
        // This is fire-and-forget. If RabbitMQ is down transiently, the
        // order is still saved. Production would add a retry/outbox pattern.
        publishEvent('order.created', {
            event: 'order.created',
            orderId: order._id.toString(),
            userId,
            totalAmount,
            items,
            createdAt: order.createdAt,
        });

        return order;
    } finally {
        await releaseLock(lockKey, lockVal);
    }
};

export const getOrdersByUser = async (userId: string) => {
    return findOrdersByUser(userId);
};

export const getOrderById = async (orderId: string, userId: string) => {
    const order = await findOrderById(orderId);

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Users can only view their own orders
    if (order.userId.toString() !== userId) {
        throw new AppError('Forbidden', 403);
    }

    return order;
};
