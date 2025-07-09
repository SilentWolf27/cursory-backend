import { Resource, CreateResourceData, UpdateResourceData } from "./resource";

/**
 * Repository interface for resource data access operations
 */
export interface ResourceRepository {
  /**
   * Create a new resource
   * @param data - Resource creation data
   * @param courseId - Course ID
   * @returns Created resource
   */
  create(data: CreateResourceData, courseId: string): Promise<Resource>;

  /**
   * Find resource by ID
   * @param id - Resource ID
   * @returns Resource or null if not found
   */
  findById(id: string): Promise<Resource | null>;

  /**
   * Find all resources for a course
   * @param courseId - Course ID
   * @returns Array of resources
   */
  findByCourseId(courseId: string): Promise<Resource[]>;

  /**
   * Update resource
   * @param id - Resource ID
   * @param data - Update data
   * @returns Updated resource
   */
  update(id: string, data: UpdateResourceData): Promise<Resource>;

  /**
   * Delete resource
   * @param id - Resource ID
   * @returns True if deleted successfully
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if resource exists
   * @param id - Resource ID
   * @returns True if resource exists
   */
  exists(id: string): Promise<boolean>;
}
