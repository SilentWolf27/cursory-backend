import { Course } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface GetCourseByIdRequest {
  courseId: string;
  userId: string;
}

export interface GetCourseByIdResponse {
  course: Course;
}

/**
 * Get course by ID with ownership validation
 * @param request - Get course request
 * @param courseRepository - Course repository
 * @returns Course if found and accessible
 */
export async function getCourseByIdUseCase(
  request: GetCourseByIdRequest,
  courseRepository: CourseRepository
): Promise<GetCourseByIdResponse> {
  const { courseId, userId } = request;

  const course = await courseRepository.findById(courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");

  if (course.userId !== userId)
    throw ErrorFactory.forbidden("You are not allowed to access this course");

  return { course };
}
