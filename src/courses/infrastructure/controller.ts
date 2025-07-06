import { Request, Response } from "express";
import { courseRepository } from "./repository-impl";
import { createCourse as createCourseUseCase } from "../application/create-course-use-case";

/**
 * Creates a new course
 */
export async function createCourse(req: Request, res: Response): Promise<void> {
  const courseData = req.body;

  const result = await createCourseUseCase(courseData, courseRepository);

  res.status(201).json(result.course);
}
