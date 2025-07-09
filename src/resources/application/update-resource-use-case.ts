import { ResourceRepository } from "../domain/resource-repository";
import { CourseRepository } from "../../courses/domain/course-repository";
import { UpdateResourceData } from "../domain/resource";
import { ErrorFactory } from "../../commons/error/error-factory";

/**
 * Update a resource
 * @param resourceRepository - Resource repository
 * @param courseRepository - Course repository for ownership validation
 * @param id - Resource ID
 * @param data - Update data
 * @param userId - User ID for ownership validation
 * @returns Updated resource
 */
export async function updateResourceUseCase(
  resourceRepository: ResourceRepository,
  courseRepository: CourseRepository,
  id: string,
  data: UpdateResourceData,
  userId: string
) {
  // Check if resource exists and get it for ownership validation
  const resource = await resourceRepository.findById(id);
  if (!resource) throw ErrorFactory.notFound("Resource not found");

  // Validate course ownership
  const course = await courseRepository.findById(resource.courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");
  
  if (course.userId !== userId) {
    throw ErrorFactory.forbidden("You are not allowed to update resources in this course");
  }

  // Update resource
  const updatedResource = await resourceRepository.update(id, data);

  return updatedResource;
}
