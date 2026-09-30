import { randomBytes } from 'crypto';
import redisClient from '../config/redis.js';

export const acquireLock = async (resource: string, ttlSeconds: number = 5): Promise<string | null> => {
    const lockVal = randomBytes(16).toString('hex');
    const lockKey = `lock:${resource}`;

    const acquired = await redisClient.set(lockKey, lockVal, {
        NX: true,
        EX: ttlSeconds
    });

    if (acquired) return lockVal;
    return null; // lock not acquired
}

export const releaseLock = async (resource: string, lockVal: string): Promise<boolean> => {
    const lockKey = `lock:${resource}`;
    
    // Lua script for atomicity
    const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
    `;

    const result = await redisClient.eval(luaScript, {
        keys: [lockKey],
        arguments: [lockVal]
    });

    return result === 1;
}
