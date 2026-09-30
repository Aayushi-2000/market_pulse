import rateLimit from 'express-rate-limit';

// Global API Rate Limiter (Phase 4.6)
// Prevents API abuse by limiting each IP to 100 requests per 15-minute window
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});

// Stricter Rate Limiter for sensitive endpoints like auth/login
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20, // 20 requests per 15 minutes
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later',
    },
});
