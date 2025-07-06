import "dotenv/config";

/**
 * Server configuration
 */
export const serverConfig = {
  port: process.env["PORT"] || 3000,
  nodeEnv: process.env["NODE_ENV"] || "development",
  logLevel: process.env["LOG_LEVEL"] || "info",
} as const;

/**
 * Database configuration
 */
export const databaseConfig = {
  url: process.env["DATABASE_URL"],
} as const;

/**
 * JWT configuration
 */
export const jwtConfig = {
  secret: process.env["JWT_SECRET"] || "your-super-secret-jwt-key-here",
  expiresIn: process.env["JWT_EXPIRES_IN"] || "7d",
} as const;

/**
 * CORS configuration
 */
export const corsConfig = {
  origin: process.env["CORS_ORIGIN"] || "http://localhost:3000",
} as const;

/**
 * Railway configuration (for production)
 */
export const railwayConfig = {
  staticUrl: process.env["RAILWAY_STATIC_URL"] || "",
} as const;
