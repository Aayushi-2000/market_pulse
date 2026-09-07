import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 4000,

  PRODUCT_SERVICE_URL:
    process.env.PRODUCT_SERVICE_URL ||
    "http://localhost:4001",

  AUTH_SERVICE_URL:
    process.env.AUTH_SERVICE_URL ||
    "http://localhost:4002",
};