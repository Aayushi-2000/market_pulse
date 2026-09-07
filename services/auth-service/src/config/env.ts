import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const variableName of requiredEnvVariables) {
  if (!process.env[variableName]) {
    throw new Error(
      `Missing environment variable: ${variableName}`
    );
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 4002,

  MONGODB_URI: process.env.MONGODB_URI!,

  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET!,

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET!,

  ACCESS_TOKEN_EXPIRES_IN:
    process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",

  REFRESH_TOKEN_EXPIRES_IN:
    process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
};