import { Router } from "express";
import { authMiddleware } from "../../auth/infrastructure/auth-middleware";
import {
  handleCreateModule,
  handleGetModuleById,
  handleUpdateModule,
  handleDeleteModule,
} from "./module-controller";

const router = Router();

router.use(authMiddleware);

router.post("/courses/:courseId/modules", handleCreateModule);

router.get("/courses/:courseId/modules/:moduleId", handleGetModuleById);

router.put("/courses/:courseId/modules/:moduleId", handleUpdateModule);

router.delete("/courses/:courseId/modules/:moduleId", handleDeleteModule);

export { router as moduleRouter };
