import type{
  Request,
  Response,
  NextFunction,
} from "express";

import { incrementWithExpiry } from "../utils/redis-counter.js";
import { AppError } from "../utils/app-error.js";
import redisClient from "../config/redis.js";

interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
  keyPrefix: string;
}

export const rateLimit = ({
  limit,
  windowSeconds,
  keyPrefix,
}: RateLimitOptions) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ip = req.ip || "unknown";

      const key = `${keyPrefix}:ip:${ip}`;

      const count =
        await incrementWithExpiry(
          key,
          windowSeconds
        );

      const remaining = Math.max(
        limit - count,
        0
      );

      res.setHeader(
        "X-RateLimit-Limit",
        limit
      );

      res.setHeader(
        "X-RateLimit-Remaining",
        remaining
      );

      if (count > limit) {
        const ttl =
          await redisClient.ttl(key);

        res.setHeader(
          "Retry-After",
          ttl
        );

        return next(
          new AppError(
            "Too many requests. Please try again later.",
            429
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};