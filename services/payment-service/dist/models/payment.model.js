import mongoose, { Schema } from 'mongoose';
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (PaymentStatus = {}));
const paymentSchema = new Schema({
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    transactionId: { type: String },
}, { timestamps: true });
export const Payment = mongoose.model('Payment', paymentSchema);
