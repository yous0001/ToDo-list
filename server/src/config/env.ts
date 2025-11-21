import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const required = ["MONGODB_URI", "MONGODB_DB_NAME"] as const;

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  mongoUri: process.env.MONGODB_URI as string,
  mongoDbName: process.env.MONGODB_DB_NAME as string,
  corsOrigin: process.env.CORS_ORIGIN,
};
