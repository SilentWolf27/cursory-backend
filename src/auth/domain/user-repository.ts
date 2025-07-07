import { User } from "./user";

/**
 * Repository interface for User entity operations
 */
export interface UserRepository {
  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user
   */
  create(userData: Pick<User, "name" | "email" | "password">): Promise<User>;

  /**
   * Update user by ID
   */
  update(id: string, data: Partial<User>): Promise<User>;

  /**
   * Delete user by ID (soft delete)
   */
  delete(id: string): Promise<User>;
}
