import { ModuleRepository } from "../domain/module-repository";
import { CourseRepository } from "../../courses/domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface DeleteModuleRequest {
  moduleId: string;
  userId: string;
  courseId: string;
}

/**
 * Delete module by ID with ownership validation
 * @param request - Delete module request
 * @param moduleRepository - Module repository
 * @param courseRepository - Course repository for permission validation
 */
export async function deleteModuleUseCase(
  request: DeleteModuleRequest,
  moduleRepository: ModuleRepository,
  courseRepository: CourseRepository
): Promise<void> {
  const { moduleId, userId, courseId } = request;

  const existingModule = await moduleRepository.findById(moduleId);
  if (!existingModule) throw ErrorFactory.notFound("Module not found");

  if (existingModule.courseId !== courseId)
    throw ErrorFactory.notFound("Module not found in this course");

  const course = await courseRepository.findById(courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");

  if (course.userId !== userId)
    throw ErrorFactory.forbidden("You are not allowed to delete this module");

  const success = await moduleRepository.delete(moduleId);
  if (!success) throw ErrorFactory.internal("Failed to delete module");
}
