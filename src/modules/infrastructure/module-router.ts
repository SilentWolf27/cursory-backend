import { Router } from "express";
import { authMiddleware } from "../../auth/infrastructure/auth-middleware";
import {
  handleCreateModule,
  handleUpdateModule,
  handleDeleteModule,
  handleGenerateModules,
  handleCreateModulesBulk,
} from "./module-controller";

const router = Router();

router.use(authMiddleware);

router.post("/:courseId/modules", handleCreateModule);
router.post("/:courseId/modules/bulk", handleCreateModulesBulk);
router.post("/:courseId/modules/generate", handleGenerateModules);

router.put("/:courseId/modules/:moduleId", handleUpdateModule);

router.delete("/:courseId/modules/:moduleId", handleDeleteModule);

export { router as moduleRouter };
