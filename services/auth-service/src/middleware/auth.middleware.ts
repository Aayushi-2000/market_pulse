import type{
  Request,
  Response,
  NextFunction,
} from "express";

import {
  verifyAccessToken,
} from "../utils/jwt.js";

import {
  AppError,
} from "../utils/app-error.js";
import type { UserRole } from "../types/user.types.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorizationHeader =
    req.headers.authorization;

  if (!authorizationHeader) {
    return next(
      new AppError(
        "Authentication token is required",
        401
      )
    );
  }

  const [scheme, token] =
    authorizationHeader.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    return next(
      new AppError(
        "Invalid authorization format",
        401
      )
    );
  }

  try {
    const payload =
      verifyAccessToken(token);

    if (payload.type !== "access") {
      return next(
        new AppError(
          "Invalid access token",
          401
        )
      );
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();

  } catch {
    next(
      new AppError(
        "Invalid or expired access token",
        401
      )
    );
  }
};
export const authorize = (
  ...allowedRoles: UserRole[]
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401
        )
      );
    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };
};