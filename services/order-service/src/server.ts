import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/ auth.routes.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import {
  errorHandler,
} from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import redisClient from "./config/redis.js";
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);
app.use(cookieParser());
app.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      success: true,
      service: "Auth Service",
    });
  }
);
app.use(
  "/auth",
  authRoutes
);
const startServer = async () => {
  await connectDatabase();
  await redisClient.connect();

  app.listen(
    env.PORT,
    () => {
      console.log(
        `Auth Service running on port ${env.PORT}`
      );
    }
  );
};

startServer();