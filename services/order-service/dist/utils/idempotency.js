import redisClient from '../config/redis.js';
import { acquireLock, releaseLock } from './redis-lock.js';
export const tryProcessIdempotent = async (idempotencyKey, operation) => {
    const STATUS_KEY = `idempotency:status:${idempotencyKey}`;
    const RESULT_KEY = `idempotency:result:${idempotencyKey}`;
    const lockVal = await acquireLock(idempotencyKey, 10);
    if (!lockVal) {
        throw new Error("Operation in progress");
    }
    try {
        const storedStatus = await redisClient.get(STATUS_KEY);
        if (storedStatus === 'DONE') {
            const storedResult = await redisClient.get(RESULT_KEY);
            return storedResult ? JSON.parse(storedResult) : null;
        }
        const result = await operation();
        await redisClient.set(STATUS_KEY, 'DONE', { EX: 86400 }); // 24h
        await redisClient.set(RESULT_KEY, JSON.stringify(result), { EX: 86400 });
        return result;
    }
    finally {
        await releaseLock(idempotencyKey, lockVal);
    }
};
