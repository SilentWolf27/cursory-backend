import "dotenv/config";

const {
  PORT,
  NODE_ENV,
  LOG_LEVEL,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CORS_ORIGIN,
  RAILWAY_STATIC_URL,
  OPENAI_API_KEY,
  OPENAI_MODEL,
} = process.env;

export const serverConfig = {
  port: PORT || 3000,
  nodeEnv: NODE_ENV || "development",
  logLevel: LOG_LEVEL || "info",
} as const;

export const databaseConfig = {
  url: DATABASE_URL,
} as const;

export const jwtConfig = {
  secret: JWT_SECRET || "your-super-secret-jwt-key-here",
  expiresIn: JWT_EXPIRES_IN || "7d",
  accessTokenExpiresIn: 3600, // 1 hour in seconds
  refreshTokenExpiresIn: 604800, // 7 days in seconds
} as const;

export const corsConfig = {
  origin: CORS_ORIGIN || "http://localhost:3000",
} as const;

export const railwayConfig = {
  staticUrl: RAILWAY_STATIC_URL || "",
} as const;

export const aiConfig = {
  openai: {
    apiKey: OPENAI_API_KEY,
    model: OPENAI_MODEL || "gpt-4o-mini",
  },
  defaultProvider: "openai" as "openai",
} as const;
