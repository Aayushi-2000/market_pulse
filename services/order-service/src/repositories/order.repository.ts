import { Order } from '../models/order.model.js';
import { type IOrderItem } from '../types/order.types.js';

export const createOrder = async (data: {
    userId: string;
    items: IOrderItem[];
    totalAmount: number;
    idempotencyKey?: string;
}) => {
    return Order.create(data);
};

export const findOrdersByUser = async (userId: string) => {
    return Order.find({ userId }).sort({ createdAt: -1 });
};

export const findOrderById = async (orderId: string) => {
    return Order.findById(orderId);
};

export const findOrderByIdempotencyKey = async (key: string) => {
    return Order.findOne({ idempotencyKey: key });
};
