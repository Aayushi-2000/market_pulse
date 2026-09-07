import express from "express";

import cors from "cors";

import helmet from "helmet";

import morgan from "morgan";

import proxyRoutes from "./routes/proxy.routes";

import { env } from "./config/env";

const app = express();

app.use(helmet());


app.use(
  cors({
    origin: "*",
  })
);



app.use(morgan("dev"));


app.get(
  "/health",
  (_req, res) => {
    res.json({
      success: true,

      service: "API Gateway",
    });
  }
);


app.use(
  "/api",
  proxyRoutes
);


app.listen(
  env.PORT,
  () => {
    console.log(
      `API Gateway running on port ${env.PORT}`
    );
  }
);