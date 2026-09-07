import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type { ZodSchema } from "zod";

export const validate = (
  schema: ZodSchema
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const result = schema.parse(
        req.body
      );

      req.body = result;

      next();
    } catch (error) {
      next(error);
    }
  };
};