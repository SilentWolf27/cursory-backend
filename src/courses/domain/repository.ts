import { Course } from "./entity";

/**
 * Abstract interface for course repository operations
 * This defines the contract that any course repository implementation must follow
 */
export interface CourseRepository {
  /**
   * Creates a new course in the repository
   * @param course - The course entity to create
   * @returns Promise resolving to the created course
   */
  create(course: Course): Promise<Course>;

  /**
   * Finds a course by its unique identifier
   * @param id - The course ID to search for
   * @returns Promise resolving to the course if found, null otherwise
   */
  findById(id: string): Promise<Course | null>;

  /**
   * Finds a course by its slug
   * @param slug - The course slug to search for
   * @returns Promise resolving to the course if found, null otherwise
   */
  findBySlug(slug: string): Promise<Course | null>;

  /**
   * Retrieves all courses from the repository
   * @returns Promise resolving to an array of all courses
   */
  findAll(): Promise<Course[]>;

  /**
   * Updates an existing course in the repository
   * @param id - The course ID to update
   * @param data - Partial course data to update
   * @returns Promise resolving to the updated course
   */
  update(id: string, data: Partial<Course>): Promise<Course>;

  /**
   * Deletes a course from the repository
   * @param id - The ID of the course to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Checks if a course with the given slug already exists
   * @param slug - The slug to check
   * @returns Promise resolving to true if slug exists, false otherwise
   */
  existsBySlug(slug: string): Promise<boolean>;
}
