import { Express } from "express";
import { authRouter } from "./auth/infrastructure/auth-router";
import { courseRouter } from "./courses/infrastructure/course-router";

/**
 * Registers all application routes
 */
export function registerRoutes(app: Express): void {
  app.use("/auth", authRouter);
  app.use("/courses", courseRouter);
}
