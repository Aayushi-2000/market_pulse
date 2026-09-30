import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { errorHandler } from './middleware/error.middleware.js';
import orderRoutes from './routes/order.routes.js';
import redisClient from './config/redis.js';
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, service: 'Order Service' });
});
app.use('/orders', orderRoutes);
app.use(errorHandler);
const startServer = async () => {
    await connectDatabase();
    await redisClient.connect();
    await connectRabbitMQ();
    app.listen(env.PORT, () => {
        console.log(`🚀 Order Service running on port ${env.PORT}`);
    });
};
startServer();
