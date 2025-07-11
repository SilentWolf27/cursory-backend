import { Router } from "express";
import { authMiddleware } from "../../auth/infrastructure/auth-middleware";
import {
  handleCreateCourse,
  handleGetCourses,
  handleGetCourseById,
  handleUpdateCourse,
  handleDeleteCourse,
} from "./course-controller";

const courseRouter = Router();

courseRouter.use(authMiddleware);

courseRouter.post("/", handleCreateCourse);
courseRouter.get("/", handleGetCourses);
courseRouter.get("/:id", handleGetCourseById);
courseRouter.put("/:id", handleUpdateCourse);
courseRouter.delete("/:id", handleDeleteCourse);

export { courseRouter };
