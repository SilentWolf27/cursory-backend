import { ResourceRepository } from "../domain/resource-repository";
import { CourseRepository } from "../../courses/domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

/**
 * Delete a resource
 * @param resourceRepository - Resource repository
 * @param courseRepository - Course repository for ownership validation
 * @param id - Resource ID
 * @param userId - User ID for ownership validation
 * @returns True if deleted successfully
 */
export async function deleteResourceUseCase(
  resourceRepository: ResourceRepository,
  courseRepository: CourseRepository,
  id: string,
  userId: string
) {
  // Check if resource exists and get it for ownership validation
  const resource = await resourceRepository.findById(id);
  if (!resource) throw ErrorFactory.notFound("Resource not found");

  // Validate course ownership
  const course = await courseRepository.findById(resource.courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");
  
  if (course.userId !== userId) {
    throw ErrorFactory.forbidden("You are not allowed to delete resources from this course");
  }

  // Delete resource
  const deleted = await resourceRepository.delete(id);

  if (!deleted) {
    throw ErrorFactory.internal("Failed to delete resource");
  }

  return deleted;
}
