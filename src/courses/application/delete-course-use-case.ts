import { CourseRepository } from "../domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface DeleteCourseRequest {
  courseId: string;
  userId: string;
}

export interface DeleteCourseResponse {
  success: boolean;
}

/**
 * Delete course with validation
 * @param request - Delete course request
 * @param courseRepository - Course repository
 * @returns Success status
 */
export async function deleteCourseUseCase(
  request: DeleteCourseRequest,
  courseRepository: CourseRepository
): Promise<DeleteCourseResponse> {
  const { courseId, userId } = request;

  const existingCourse = await courseRepository.findById(courseId);
  if (!existingCourse) throw ErrorFactory.notFound("Course not found");

  if (existingCourse.userId !== userId)
    throw ErrorFactory.forbidden("You are not allowed to delete this course");

  const success = await courseRepository.delete(courseId);
  if (!success) throw ErrorFactory.internal("Failed to delete course");

  return { success };
}
