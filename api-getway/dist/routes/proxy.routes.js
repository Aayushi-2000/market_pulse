import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { env } from '../config/env.js';
const router = Router();
const createServiceProxy = (target, pathRewrite) => {
    const options = {
        target,
        changeOrigin: true,
        on: {
            error: (err, _req, res) => {
                console.error(`[Gateway Proxy Error] Target ${target} unreachable:`, err.message);
                if (res && typeof res.status === 'function' && !res.headersSent) {
                    res.status(503).json({
                        success: false,
                        message: `Service at ${target} is currently unavailable or unreachable`,
                    });
                }
            },
        },
    };
    if (pathRewrite) {
        options.pathRewrite = pathRewrite;
    }
    return createProxyMiddleware(options);
};
// Route mappings for all microservices
router.use('/auth', createServiceProxy(env.AUTH_SERVICE_URL));
router.use('/products', createServiceProxy(env.PRODUCT_SERVICE_URL));
router.use('/orders', createServiceProxy(env.ORDER_SERVICE_URL));
router.use('/payments', createServiceProxy(env.PAYMENT_SERVICE_URL));
router.use('/scraper', createServiceProxy(env.SCRAPER_SERVICE_URL));
export default router;
