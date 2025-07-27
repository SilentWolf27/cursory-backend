import type { Request, Response } from "express";
import { User } from "../../auth/domain/user";
import { courseRepository } from "./course-repository";
import {
  createCourseUseCase,
  CreateCourseRequest,
} from "../application/create-course-use-case";
import {
  getCoursesUseCase,
  GetCoursesRequest,
} from "../application/get-courses-use-case";
import {
  getCourseByIdUseCase,
  GetCourseByIdRequest,
} from "../application/get-course-by-id-use-case";
import {
  updateCourseUseCase,
  UpdateCourseRequest,
} from "../application/update-course-use-case";
import {
  deleteCourseUseCase,
  DeleteCourseRequest,
} from "../application/delete-course-use-case";
import {
  generateCourseUseCase,
  GenerateCourseRequest,
} from "../application/generate-course-use-case";

/**
 * Create a new course
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleCreateCourse(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { title, description, slug, tags, visibility } = req.body;

  const request: CreateCourseRequest = {
    data: {
      title,
      description,
      slug,
      tags,
      visibility,
      userId: user.id,
    },
    userId: user.id,
  };

  const { course } = await createCourseUseCase(request, courseRepository);

  res.status(201).json(course);
}

/**
 * Get all courses for the current user
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleGetCourses(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;

  const request: GetCoursesRequest = {
    userId: user.id,
  };

  const response = await getCoursesUseCase(request, courseRepository);

  res.status(200).json(response);
}

/**
 * Get course by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleGetCourseById(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Course ID is required" });
    return;
  }

  const request: GetCourseByIdRequest = {
    courseId: id,
    userId: user.id,
  };

  const { course } = await getCourseByIdUseCase(request, courseRepository);

  res.status(200).json(course);
}

/**
 * Update course by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleUpdateCourse(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { id } = req.params;
  const { title, description, slug, tags, visibility } = req.body;

  if (!id) {
    res.status(400).json({ error: "Course ID is required" });
    return;
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (slug !== undefined) updateData.slug = slug;
  if (tags !== undefined) updateData.tags = tags;
  if (visibility !== undefined) updateData.visibility = visibility;

  const request: UpdateCourseRequest = {
    courseId: id,
    data: updateData,
    userId: user.id,
  };

  const { course } = await updateCourseUseCase(request, courseRepository);

  res.status(200).json(course);
}

/**
 * Delete course by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleDeleteCourse(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Course ID is required" });
    return;
  }

  const request: DeleteCourseRequest = {
    courseId: id,
    userId: user.id,
  };

  await deleteCourseUseCase(request, courseRepository);

  res.status(204).send();
}

/**
 * Generate course using AI
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleGenerateCourse(
  req: Request,
  res: Response
): Promise<void> {
  const { description, objective, difficulty } = req.body;

  const request: GenerateCourseRequest = {
    description,
    objective,
    difficulty,
  };

  const { course } = await generateCourseUseCase(request);

  res.status(201).json(course);
}
