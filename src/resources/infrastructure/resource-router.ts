import { Router } from "express";
import { authMiddleware } from "../../auth/infrastructure/auth-middleware";
import {
  handleCreateResource,
  handleUpdateResource,
  handleDeleteResource,
} from "./resource-controller";

const resourceRouter = Router();

resourceRouter.use(authMiddleware);

resourceRouter.post("/courses/:courseId/resources", handleCreateResource);

resourceRouter.put(
  "/courses/:courseId/resources/:resourceId",
  handleUpdateResource
);
resourceRouter.delete(
  "/courses/:courseId/resources/:resourceId",
  handleDeleteResource
);

export { resourceRouter };
