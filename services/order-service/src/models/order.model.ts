import mongoose, { Schema } from 'mongoose';
import { OrderStatus, type IOrder } from '../types/order.types.js';

const orderItemSchema = new Schema({
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    price:     { type: Number, required: true, min: 0 },
    quantity:  { type: Number, required: true, min: 1 },
});

const orderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
            index: true,
        },
        idempotencyKey: {
            type: String,
            unique: true,
            sparse: true, // allows null/undefined without unique conflicts
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
