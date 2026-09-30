import { Router, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { env } from '../config/env.js';
import { CircuitBreaker } from '../utils/circuit-breaker.js';
import { authRateLimiter } from '../middleware/rate-limiter.middleware.js';

const router = Router();

// Create Circuit Breaker instances for each downstream microservice
const circuitBreakers: Record<string, CircuitBreaker> = {
    auth: new CircuitBreaker('Auth Service', { failureThreshold: 3, resetTimeoutMs: 10000 }),
    products: new CircuitBreaker('Product Service', { failureThreshold: 3, resetTimeoutMs: 10000 }),
    orders: new CircuitBreaker('Order Service', { failureThreshold: 3, resetTimeoutMs: 10000 }),
    payments: new CircuitBreaker('Payment Service', { failureThreshold: 3, resetTimeoutMs: 10000 }),
    scraper: new CircuitBreaker('Scraper Service', { failureThreshold: 3, resetTimeoutMs: 10000 }),
};

// Middleware wrapper enforcing Circuit Breaker state before proxying
const withCircuitBreaker = (serviceKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const breaker = circuitBreakers[serviceKey];

        if (!breaker.canExecute()) {
            return res.status(503).json({
                success: false,
                message: `[Circuit Breaker OPEN] ${breaker.serviceName} is currently unavailable. Failing fast.`,
                circuitState: breaker.state,
            });
        }
        next();
    };
};

const createServiceProxy = (serviceKey: string, target: string): any => {
    const breaker = circuitBreakers[serviceKey];

    const options: Options = {
        target,
        changeOrigin: true,
        on: {
            proxyRes: (_proxyRes, _req, _res) => {
                // Successful response resets failure count and closes circuit
                breaker.recordSuccess();
            },
            error: (err: Error, _req: any, res: any) => {
                // Error trips or counts towards circuit breaker failure threshold
                breaker.recordFailure();
                if (res && typeof res.status === 'function' && !res.headersSent) {
                    res.status(503).json({
                        success: false,
                        message: `Service at ${target} is currently unreachable.`,
                        circuitState: breaker.state,
                    });
                }
            },
        },
    };

    return createProxyMiddleware(options);
};

// Route mappings with Circuit Breakers & Rate Limiters
router.use('/auth', authRateLimiter, withCircuitBreaker('auth'), createServiceProxy('auth', env.AUTH_SERVICE_URL));
router.use('/products', withCircuitBreaker('products'), createServiceProxy('products', env.PRODUCT_SERVICE_URL));
router.use('/orders', withCircuitBreaker('orders'), createServiceProxy('orders', env.ORDER_SERVICE_URL));
router.use('/payments', withCircuitBreaker('payments'), createServiceProxy('payments', env.PAYMENT_SERVICE_URL));
router.use('/scraper', withCircuitBreaker('scraper'), createServiceProxy('scraper', env.SCRAPER_SERVICE_URL));

export default router;