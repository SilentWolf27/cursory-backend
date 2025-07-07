import "dotenv/config";

export const serverConfig = {
  port: process.env["PORT"] || 3000,
  nodeEnv: process.env["NODE_ENV"] || "development",
  logLevel: process.env["LOG_LEVEL"] || "info",
} as const;

export const databaseConfig = {
  url: process.env["DATABASE_URL"],
} as const;

export const jwtConfig = {
  secret: process.env["JWT_SECRET"] || "your-super-secret-jwt-key-here",
  expiresIn: process.env["JWT_EXPIRES_IN"] || "7d",
  accessTokenExpiresIn: 3600, // 1 hour in seconds
  refreshTokenExpiresIn: 604800, // 7 days in seconds
} as const;

export const corsConfig = {
  origin: process.env["CORS_ORIGIN"] || "http://localhost:3000",
} as const;

export const railwayConfig = {
  staticUrl: process.env["RAILWAY_STATIC_URL"] || "",
} as const;
