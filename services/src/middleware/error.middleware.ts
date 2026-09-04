import type{
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

  let message = "Internal server error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  if (
    error instanceof mongoose.mongo.MongoServerError &&
    error.code === 11000
  ) {
    statusCode = 409;

    const field = Object.keys(
      error.keyPattern || {}
    )[0];

    message = `${field} already exists`;
  }

 
  if (
    error instanceof mongoose.Error.CastError
  ) {
    statusCode = 400;

    message = `Invalid ${error.path}`;
  }

 
  if (error instanceof ZodError) {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,

      message: "Validation failed",

      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};