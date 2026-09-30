import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app-error.js';
import { env } from '../config/env.js';
/**
 * Verify the JWT access token issued by auth-service.
 * The order-service only needs to read the token — it does NOT
 * issue or manage tokens. We simply trust what auth-service signed.
 */
export const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new AppError('Authentication token is required', 401));
    }
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return next(new AppError('Invalid authorization format', 401));
    }
    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
        if (payload.type !== 'access') {
            return next(new AppError('Invalid access token type', 401));
        }
        req.user = { id: payload.sub, role: payload.role };
        next();
    }
    catch {
        next(new AppError('Invalid or expired access token', 401));
    }
};
