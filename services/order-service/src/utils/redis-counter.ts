import redisClient from "../config/redis.js";

export const incrementWithExpiry = async (
  key: string,
  windowSeconds: number
) => {
  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(
      key,
      windowSeconds
    );
  }

  return count;
};