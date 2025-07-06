import { Router } from "express";
import { createCourse } from "./controller";

const router = Router();

router.post("/", createCourse);

export { router as courseRoutes };
