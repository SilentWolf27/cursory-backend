import { Module, CreateModuleData, UpdateModuleData } from "./module";

export interface ModuleRepository {
  /**
   * Create a new module
   * @param data - Module creation data
   * @returns Created module
   */
  create(data: CreateModuleData): Promise<Module>;

  /**
   * Find module by ID
   * @param id - Module ID
   * @returns Module or null if not found
   */
  findById(id: string): Promise<Module | null>;

  /**
   * Find all modules for a course
   * @param courseId - Course ID
   * @returns Array of modules ordered by position
   */
  findByCourseId(courseId: string): Promise<Module[]>;

  /**
   * Update module
   * @param id - Module ID
   * @param data - Update data
   * @returns Updated module
   */
  update(id: string, data: UpdateModuleData): Promise<Module>;

  /**
   * Delete module
   * @param id - Module ID
   * @returns True if deleted successfully
   */
  delete(id: string): Promise<boolean>;
}
