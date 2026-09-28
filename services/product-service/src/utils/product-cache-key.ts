import type { Request } from "express";

export const generateProductsCacheKey = (
  req: Request
) => {
  const query = new URLSearchParams();

  Object.keys(req.query)
    .sort()
    .forEach((key) => {
      const value = req.query[key];

      if (value !== undefined) {
        query.append(key, String(value));
      }
    });

  return `products:${query.toString() || "default"}`;
};

