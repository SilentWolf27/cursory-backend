import { Router } from "express";
import { authMiddleware } from "../../auth/infrastructure/auth-middleware";
import {
  handleCreateModule,
  handleUpdateModule,
  handleDeleteModule,
} from "./module-controller";

const router = Router();

router.use(authMiddleware);

router.post("/courses/:courseId/modules", handleCreateModule);

router.put("/courses/:courseId/modules/:moduleId", handleUpdateModule);

router.delete("/courses/:courseId/modules/:moduleId", handleDeleteModule);

export { router as moduleRouter };
