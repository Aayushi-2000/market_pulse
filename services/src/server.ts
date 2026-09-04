import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectDatabase } from "./config/database.js";
import productRoutes from "./routes/product.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "product-service",
  });
});

app.use("/products", productRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4001;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `Product service running on port ${PORT}`
    );
  });
};

startServer();