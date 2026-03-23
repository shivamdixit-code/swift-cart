import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  adminOrigin: process.env.ADMIN_ORIGIN || "http://localhost:3001",
  adminEmail: process.env.ADMIN_EMAIL || "admin@swiftcart.local",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  jwtSecret: process.env.JWT_SECRET || "quick-commerce-dev-secret",
};
