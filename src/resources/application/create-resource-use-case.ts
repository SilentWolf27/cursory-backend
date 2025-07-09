import { ResourceRepository } from "../domain/resource-repository";
import { CourseRepository } from "../../courses/domain/course-repository";
import { CreateResourceData, createResource } from "../domain/resource";
import { ErrorFactory } from "../../commons/error/error-factory";

/**
 * Create a new resource
 * @param resourceRepository - Resource repository
 * @param courseRepository - Course repository for ownership validation
 * @param data - Resource creation data (from request body)
 * @param courseId - Course ID (from URL path)
 * @param userId - User ID for ownership validation
 * @returns Created resource
 */
export async function createResourceUseCase(
  resourceRepository: ResourceRepository,
  courseRepository: CourseRepository,
  data: CreateResourceData,
  courseId: string,
  userId: string
) {
  const course = await courseRepository.findById(courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");
  if (course.userId !== userId) throw ErrorFactory.forbidden("Forbidden");

  const resourceData = createResource(data);

  const resource = await resourceRepository.create(resourceData, courseId);

  return resource;
}
