import { Course, CreateCourseData, createCourse } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface CreateCourseRequest {
  data: CreateCourseData;
  userId: string;
}

export interface CreateCourseResponse {
  course: Course;
}

/**
 * Create a new course
 * @param request - Create course request
 * @param courseRepository - Course repository
 * @returns Created course
 */
export async function createCourseUseCase(
  request: CreateCourseRequest,
  courseRepository: CourseRepository
): Promise<CreateCourseResponse> {
  const { data, userId } = request;

  const slugExists = await courseRepository.slugExists(data.slug);
  if (slugExists)
    throw ErrorFactory.conflict("Course with the provided slug already exists");

  const courseData = createCourse(data);

  const course = await courseRepository.create(courseData, userId);

  return { course };
}
