import mongoose, { Schema, Document } from 'mongoose';

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface IPayment extends Document {
    orderId: string;
    userId: string;
    amount: number;
    status: PaymentStatus;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        orderId: { type: String, required: true, unique: true, index: true },
        userId: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
        status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
        transactionId: { type: String },
    },
    { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
