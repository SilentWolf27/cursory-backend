import { Router } from "express";
import { authMiddleware } from "../../auth/infrastructure/auth-middleware";
import {
  handleCreateResource,
  handleUpdateResource,
  handleDeleteResource,
} from "./resource-controller";

const router = Router();

router.use(authMiddleware);

router.post("/:courseId/resources", handleCreateResource);

router.put(
  "/:courseId/resources/:resourceId",
  handleUpdateResource
);
router.delete(
  "/:courseId/resources/:resourceId",
  handleDeleteResource
);

export { router as resourceRouter };
