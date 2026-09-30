import { Order } from '../models/order.model.js';
export const createOrder = async (data) => {
    return Order.create(data);
};
export const findOrdersByUser = async (userId) => {
    return Order.find({ userId }).sort({ createdAt: -1 });
};
export const findOrderById = async (orderId) => {
    return Order.findById(orderId);
};
export const findOrderByIdempotencyKey = async (key) => {
    return Order.findOne({ idempotencyKey: key });
};
