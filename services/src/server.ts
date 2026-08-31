import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "api-gateway",
    message: "MarketPulse API Gateway is running",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});