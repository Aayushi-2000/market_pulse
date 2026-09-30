import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import proxyRoutes from './routes/proxy.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { env } from './config/env.js';
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(morgan('dev'));
// Healthcheck endpoint for Gateway itself
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        service: 'API Gateway',
        status: 'UP',
        timestamp: new Date().toISOString(),
    });
});
// Proxy route mounts under /api
app.use('/api', proxyRoutes);
// Global Error Middleware
app.use(errorHandler);
app.listen(env.PORT, () => {
    console.log(`🌐 API Gateway running on http://localhost:${env.PORT}`);
    console.log(`   Mapped Proxies:`);
    console.log(`   - /api/auth     -> ${env.AUTH_SERVICE_URL}`);
    console.log(`   - /api/products -> ${env.PRODUCT_SERVICE_URL}`);
    console.log(`   - /api/orders   -> ${env.ORDER_SERVICE_URL}`);
    console.log(`   - /api/payments -> ${env.PAYMENT_SERVICE_URL}`);
    console.log(`   - /api/scraper  -> ${env.SCRAPER_SERVICE_URL}`);
});
