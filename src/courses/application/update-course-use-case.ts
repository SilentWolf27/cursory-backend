import { Course, UpdateCourseData, updateCourse } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface UpdateCourseRequest {
  courseId: string;
  data: UpdateCourseData;
  userId: string;
}

export interface UpdateCourseResponse {
  course: Course;
}

/**
 * Update course with validation
 * @param request - Update course request
 * @param courseRepository - Course repository
 * @returns Updated course
 */
export async function updateCourseUseCase(
  request: UpdateCourseRequest,
  courseRepository: CourseRepository
): Promise<UpdateCourseResponse> {
  const { courseId, data, userId } = request;

  const existingCourse = await courseRepository.findById(courseId);
  if (!existingCourse) throw ErrorFactory.notFound("Course not found");

  if (existingCourse.userId !== userId)
    throw ErrorFactory.forbidden("You are not allowed to update this course");

  if (data.slug && data.slug !== existingCourse.slug) {
    const slugExists = await courseRepository.slugExists(data.slug);
    if (slugExists)
      throw ErrorFactory.conflict(
        "Course with the provided slug already exists"
      );
  }

  const updatedData = updateCourse(existingCourse, data);

  const course = await courseRepository.update(courseId, updatedData);

  return { course };
}
