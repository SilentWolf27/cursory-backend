import { Course, CreateCourseData, UpdateCourseData } from "./course";

export interface CourseRepository {
  /**
   * Create a new course
   * @param data - Course creation data
   * @param userId - ID of the user creating the course
   * @returns Created course
   */
  create(data: CreateCourseData, userId: string): Promise<Course>;

  /**
   * Find course by ID
   * @param id - Course ID
   * @returns Course or null if not found
   */
  findById(id: string): Promise<Course | null>;

  /**
   * Find course by slug
   * @param slug - Course slug
   * @returns Course or null if not found
   */
  findBySlug(slug: string): Promise<Course | null>;

  /**
   * Find all courses for a user
   * @param userId - User ID
   * @returns Array of courses
   */
  findByUserId(userId: string): Promise<Course[]>;

  /**
   * Find all public courses
   * @returns Array of public courses
   */
  findPublic(): Promise<Course[]>;

  /**
   * Update course
   * @param id - Course ID
   * @param data - Update data
   * @returns Updated course
   */
  update(id: string, data: UpdateCourseData): Promise<Course>;

  /**
   * Delete course
   * @param id - Course ID
   * @returns True if deleted successfully
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if slug exists
   * @param slug - Course slug
   * @returns True if slug exists
   */
  slugExists(slug: string): Promise<boolean>;
}
