import { Course } from "../domain/entity";
import { CourseRepository } from "../domain/repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface CreateCourseRequest {
  title: string;
  description: string;
  slug: string;
  visibility: "public" | "private";
  tags?: string[];
}

export interface CreateCourseResponse {
  course: Course;
}

/**
 * Creates a new course
 * @param request - The course creation request data
 * @param courseRepository - The course repository
 * @returns Promise resolving to the created course
 * @throws CreateCourseError if business rules are violated
 */
export async function createCourse(
  request: CreateCourseRequest,
  courseRepository: CourseRepository
): Promise<CreateCourseResponse> {
  const existingCourse = await courseRepository.findBySlug(request.slug);
  if (existingCourse) {
    throw ErrorFactory.conflictError(
      `Course with slug '${request.slug}' already exists`
    );
  }

  const course = new Course({
    title: request.title,
    description: request.description,
    slug: request.slug,
    visibility: request.visibility,
    tags: request.tags || [],
  });

  const createdCourse = await courseRepository.create(course);

  return {
    course: createdCourse,
  };
}
