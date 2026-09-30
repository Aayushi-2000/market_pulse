import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.js';

export const requireIdempotencyKey = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey) {
        return res.status(400).json({ message: "Idempotency-Key header is required" });
    }

    const STATUS_KEY = `idempotency:status:${idempotencyKey}`;
    const storedStatus = await redisClient.get(STATUS_KEY);
    
    if (storedStatus === 'DONE') {
        const RESULT_KEY = `idempotency:result:${idempotencyKey}`;
        const storedResult = await redisClient.get(RESULT_KEY);
        
        return res.status(200).json({
            message: "Request already processed (idempotent)",
            data: storedResult ? JSON.parse(storedResult) : null
        });
    }

    next();
};
