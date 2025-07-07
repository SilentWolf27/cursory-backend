import { UserRepository } from "../domain/user-repository";
import { ErrorFactory } from "../../commons/error/error-factory";
import { comparePassword } from "../../commons/crypto/password-hasher";
import { isUserDeleted } from "../domain/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Login use case - validates user credentials and returns user data
 * @param request - Login credentials (email and password)
 * @param userRepository - Repository for user data access
 * @returns Promise resolving to user data if credentials are valid
 * @throws AppError with UNAUTHORIZED status if credentials are invalid or account is deactivated
 */
export async function login(
  request: LoginRequest,
  userRepository: UserRepository
): Promise<LoginResponse> {
  const user = await userRepository.findByEmail(request.email);
  if (!user) throw ErrorFactory.unauthorized("Invalid credentials");

  if (isUserDeleted(user))
    throw ErrorFactory.unauthorized("Account is deactivated");

  const isPasswordValid = await comparePassword(
    request.password,
    user.password
  );

  if (!isPasswordValid) throw ErrorFactory.unauthorized("Invalid credentials");

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
