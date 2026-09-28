import type {
  Request,
  Response,
  NextFunction,
} from "express";

import mongoose from "mongoose";

import { ZodError } from "zod";

import { AppError } from "../utils/app-error.js";

export const errorHandler = (
  error: Error | AppError,

  _req: Request,

  res: Response,

  _next: NextFunction
) => {
  console.error(error);

  let statusCode = 500;

  let message =
    "Internal server error";

  if (error instanceof AppError) {
    statusCode =
      error.statusCode;

    message =
      error.message;
  }

  if (
    error instanceof ZodError
  ) {
    return res.status(400).json({
      success: false,

      message:
        "Validation failed",

      errors:
        error.issues.map(
          (issue) => ({
            field:
              issue.path.join("."),

            message:
              issue.message,
          })
        ),
    });
  }

  if (
    error instanceof
      mongoose.mongo.MongoServerError &&
    error.code === 11000
  ) {
    statusCode = 409;

    message =
      "Resource already exists";
  }

  return res
    .status(statusCode)
    .json({
      success: false,

      message,
    });
};