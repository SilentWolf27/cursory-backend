import { Express } from "express";
import { authRouter } from "./auth/infrastructure/auth-router";
import { courseRouter } from "./courses/infrastructure/course-router";
import { moduleRouter } from "./modules/infrastructure/module-router";
import { resourceRouter } from "./resources/infrastructure/resource-router";

/**
 * Registers all application routes
 */
export function registerRoutes(app: Express): void {
  app.use("/auth", authRouter);
  app.use("/courses", courseRouter);
  app.use("/", moduleRouter);
  app.use("/", resourceRouter);
}
