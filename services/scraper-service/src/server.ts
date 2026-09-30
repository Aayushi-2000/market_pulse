import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { syncScrapedProducts } from './services/scraper.service.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, service: 'Scraper Service' });
});

// Manual trigger endpoint to trigger product sync/scraping job
app.post('/scrape/sync', async (_req, res) => {
    try {
        const result = await syncScrapedProducts();
        return res.status(200).json({
            success: true,
            message: 'Product scraping job completed and events published',
            data: result,
        });
    } catch (error: any) {
        console.error('Error in /scrape/sync route:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to run scraping job',
            error: error?.message || 'Internal Server Error',
        });
    }
});

const startServer = async () => {
    await connectRabbitMQ();

    app.listen(env.PORT, () => {
        console.log(`🚀 Scraper Service running on port ${env.PORT}`);
    });
};

startServer();
