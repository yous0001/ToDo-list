import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const required = [
  "MONGODB_URI",
  "MONGODB_DB_NAME",
  "JWT_SECRET",
  "APP_BASE_URL",
  "MAIL_FROM",
  "MAIL_HOST",
  "MAIL_PORT",
  "MAIL_USER",
  "MAIL_PASS",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

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
  jwtSecret: process.env.JWT_SECRET as string,
  appBaseUrl: process.env.APP_BASE_URL as string,
  mail: {
    from: process.env.MAIL_FROM as string,
    host: process.env.MAIL_HOST as string,
    port: parseInt(process.env.MAIL_PORT ?? "587", 10),
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    apiSecret: process.env.CLOUDINARY_API_SECRET as string,
    baseFolder: process.env.CLOUDINARY_BASE_FOLDER ?? "task-management",
  },
};
