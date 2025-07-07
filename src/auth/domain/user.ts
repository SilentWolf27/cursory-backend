export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Check if user is deleted (soft delete)
 * @param user - User to check
 * @returns true if user is deleted, false otherwise
 */
export function isUserDeleted(user: User): boolean {
  return user.deletedAt !== null;
}

/**
 * Create a new user instance
 * @param name - User display name
 * @param email - User email address
 * @param password - User password (will be hashed by repository)
 * @returns User data without generated fields
 */
export function createUser(
  name: string,
  email: string,
  password: string
): Pick<User, "name" | "email" | "password"> {
  return {
    name,
    email,
    password,
  };
}
