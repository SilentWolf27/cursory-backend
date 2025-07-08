import { Course } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";

export interface GetCoursesRequest {
  userId: string;
}

export interface GetCoursesResponse {
  courses: Course[];
}

/**
 * Get all courses for a user
 * @param request - Get courses request
 * @param courseRepository - Course repository
 * @returns User's courses
 */
export async function getCoursesUseCase(
  request: GetCoursesRequest,
  courseRepository: CourseRepository
): Promise<GetCoursesResponse> {
  const { userId } = request;

  const courses = await courseRepository.findByUserId(userId);

  return {
    courses,
  };
}
