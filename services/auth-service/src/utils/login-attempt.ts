import redisClient from "../config/redis.js";

export const recordFailedLogin = async (
  email: string
) => {
  const key =
    `login-failure:${email.toLowerCase()}`;

  const count =
    await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(
      key,
      10 * 60
    );
  }

  return count;
};
export const getFailedLoginAttempts = async (
  email: string
) => {
  const key =
    `login-failure:${email.toLowerCase()}`;

  const value =
    await redisClient.get(key);

  return value ? Number(value) : 0;
};
export const clearFailedLoginAttempts = async (
  email: string
) => {
  const key =
    `login-failure:${email.toLowerCase()}`;

  await redisClient.del(key);
};