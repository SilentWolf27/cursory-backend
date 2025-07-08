import { Module, UpdateModuleData } from "../domain/module";
import { ModuleRepository } from "../domain/module-repository";
import { CourseRepository } from "../../courses/domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface UpdateModuleRequest {
  moduleId: string;
  data: UpdateModuleData;
  userId: string;
  courseId: string;
}

export interface UpdateModuleResponse {
  module: Module;
}

/**
 * Update module by ID with ownership validation
 * @param request - Update module request
 * @param moduleRepository - Module repository
 * @param courseRepository - Course repository for permission validation
 * @returns Updated module
 */
export async function updateModuleUseCase(
  request: UpdateModuleRequest,
  moduleRepository: ModuleRepository,
  courseRepository: CourseRepository
): Promise<UpdateModuleResponse> {
  const { moduleId, data, userId, courseId } = request;

  const existingModule = await moduleRepository.findById(moduleId);
  if (!existingModule) throw ErrorFactory.notFound("Module not found");

  if (existingModule.courseId !== courseId)
    throw ErrorFactory.notFound("Module not found in this course");

  const course = await courseRepository.findById(courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");
  if (course.userId !== userId)
    throw ErrorFactory.forbidden("You are not allowed to update this module");

  const module = await moduleRepository.update(moduleId, data);

  return { module };
}
