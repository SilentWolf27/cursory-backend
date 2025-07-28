import { ErrorFactory } from "../../commons/error/error-factory";
import { Module, CreateModuleData } from "../domain/module";
import { ModuleRepository } from "../domain/module-repository";
import { CourseRepository } from "../../courses/domain/course-repository";

export interface CreateModulesBulkRequest {
  courseId: string;
  modules: CreateModuleData[];
  userId: string;
}

export interface CreateModulesBulkResponse {
  modules: Module[];
}

/**
 * Create multiple modules for a course
 * @param request - Create modules bulk request
 * @param moduleRepository - Module repository
 * @param courseRepository - Course repository
 * @returns Created modules
 */
export async function createModulesBulkUseCase(
  request: CreateModulesBulkRequest,
  moduleRepository: ModuleRepository,
  courseRepository: CourseRepository
): Promise<CreateModulesBulkResponse> {
  const { courseId, modules, userId } = request;

  // Validate course exists and user owns it
  const course = await courseRepository.findById(courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");

  if (course.userId !== userId)
    throw ErrorFactory.forbidden(
      "You are not allowed to create modules for this course"
    );

  // Validate modules array
  if (!Array.isArray(modules) || modules.length === 0)
    throw ErrorFactory.badRequest(
      "Modules array is required and cannot be empty"
    );

  if (modules.length > 50)
    throw ErrorFactory.badRequest("Cannot create more than 50 modules at once");

  const orders = modules.map((m) => m.order);
  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length)
    throw ErrorFactory.badRequest("Module orders must be unique");

  const createdModules = await moduleRepository.createMany(modules, courseId);

  return { modules: createdModules };
}
