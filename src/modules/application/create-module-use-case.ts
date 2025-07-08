import { Module, CreateModuleData } from "../domain/module";
import { ModuleRepository } from "../domain/module-repository";
import { CourseRepository } from "../../courses/domain/course-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

export interface CreateModuleRequest {
  data: CreateModuleData;
  userId: string;
  courseId: string;
}

export interface CreateModuleResponse {
  module: Module;
}

/**
 * Create a new module within a course
 * @param request - Create module request
 * @param moduleRepository - Module repository
 * @param courseRepository - Course repository for permission validation
 * @returns Created module
 */
export async function createModuleUseCase(
  request: CreateModuleRequest,
  moduleRepository: ModuleRepository,
  courseRepository: CourseRepository
): Promise<CreateModuleResponse> {
  const { data, userId, courseId } = request;

  // Validate that user owns the course
  const course = await courseRepository.findById(courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");
  if (course.userId !== userId)
    throw ErrorFactory.forbidden(
      "You are not allowed to create modules in this course"
    );

  const module = await moduleRepository.create(data);

  return { module };
}
