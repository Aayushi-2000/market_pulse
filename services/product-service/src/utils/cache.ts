import redisClient from "../config/redis.js";

export const setCache = async (
  key: string,
  value: unknown,
  ttlSeconds: number
) => {

  await redisClient.set(
    key,
    JSON.stringify(value),
    {
      EX: ttlSeconds,
    }
  );
};

export const getCache = async <T>(
  key: string
): Promise<T | null> => {
  const value = await redisClient.get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
};

export const deleteCache = async (
  key: string
) => {
  await redisClient.del(key);
};
export const deleteCacheByPattern = async (
  pattern: string
) => {
  const keys = await redisClient.keys(pattern);

  if (keys.length === 0) {
    return;
  }

  await redisClient.del(keys);
};