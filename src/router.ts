import { Express } from "express";
import { courseRoutes } from "./courses/infrastructure/routes";

/**
 * Registers all application routes
 */
export function registerRoutes(app: Express): void {
  // Course routes
  app.use("/courses", courseRoutes);
}
