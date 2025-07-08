import { Module } from "../domain/module";
import { ModuleRepository } from "../domain/module-repository";
import { CourseRepository } from "../../courses/domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface GetModuleByIdRequest {
  moduleId: string;
  userId: string;
  courseId: string;
}

export interface GetModuleByIdResponse {
  module: Module;
}

/**
 * Get module by ID with ownership validation
 * @param request - Get module request
 * @param moduleRepository - Module repository
 * @param courseRepository - Course repository for permission validation
 * @returns Module if found and accessible
 */
export async function getModuleByIdUseCase(
  request: GetModuleByIdRequest,
  moduleRepository: ModuleRepository,
  courseRepository: CourseRepository
): Promise<GetModuleByIdResponse> {
  const { moduleId, userId, courseId } = request;

  const module = await moduleRepository.findById(moduleId);
  if (!module) throw ErrorFactory.notFound("Module not found");

  if (module.courseId !== courseId)
    throw ErrorFactory.notFound("Module not found in this course");

  const course = await courseRepository.findById(courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");
  if (course.userId !== userId)
    throw ErrorFactory.forbidden("You are not allowed to access this module");

  return { module };
}
