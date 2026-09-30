import dotenv from 'dotenv';
dotenv.config();

export const env = {
    PORT: Number(process.env.PORT) || 4000,
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:4002',
    ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://localhost:4003',
    PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:4004',
    SCRAPER_SERVICE_URL: process.env.SCRAPER_SERVICE_URL || 'http://localhost:4005',
    PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:4001',
};