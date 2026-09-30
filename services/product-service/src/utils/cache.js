import redisClient from "../config/redis.js";
export const setCache = async (key, value, ttlSeconds) => {
    await redisClient.set(key, JSON.stringify(value), {
        EX: ttlSeconds,
    });
};
export const getCache = async (key) => {
    const value = await redisClient.get(key);
    if (!value) {
        return null;
    }
    return JSON.parse(value);
};
export const deleteCache = async (key) => {
    await redisClient.del(key);
};
export const deleteCacheByPattern = async (pattern) => {
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) {
        return;
    }
    await redisClient.del(keys);
};
//# sourceMappingURL=cache.js.map