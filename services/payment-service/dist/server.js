import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { startPaymentWorker } from './messaging/consumer.js';
import { Payment } from './models/payment.model.js';
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, service: 'Payment Service' });
});
// A simple endpoint to allow frontend/users to check payment status
app.get('/payments/:orderId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }
        return res.status(200).json({ success: true, data: payment });
    }
    catch (error) {
        console.error('Error fetching payment:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
const startServer = async () => {
    await connectDatabase();
    await connectRabbitMQ();
    await startPaymentWorker();
    app.listen(env.PORT, () => {
        console.log(`🚀 Payment Service running on port ${env.PORT}`);
    });
};
startServer();
