import { Express } from "express";
import { authRouter } from "./auth/infrastructure/auth-router";

/**
 * Registers all application routes
 */
export function registerRoutes(app: Express): void {
  // Auth routes
  app.use("/auth", authRouter);
}
