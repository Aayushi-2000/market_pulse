import crypto from "crypto";
import redisClient from "../config/redis.js";

export const acquireLock = async (
  key: string,
  ttlSeconds: number
) => {
  const lockValue = crypto.randomUUID();

  const result = await redisClient.set(
    key,
    lockValue,
    {
      NX: true,
      EX: ttlSeconds,
    }
  );

  if (result !== "OK") {
    return null;
  }

  return lockValue;
};
export const releaseLock = async (
  key: string,
  lockValue: string
) => {
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  await redisClient.eval(script, {
    keys: [key],
    arguments: [lockValue],
  });
};