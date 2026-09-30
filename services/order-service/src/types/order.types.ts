import { Document, Types } from 'mongoose';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: OrderStatus;
    idempotencyKey?: string;
    createdAt: Date;
    updatedAt: Date;
}
