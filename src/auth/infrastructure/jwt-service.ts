import jwt, { SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../../config/environment";

/**
 * Generate JWT token with specified expiration
 * @param userId - User ID to include in token payload
 * @param expiresIn - Token expiration time in seconds
 * @returns JWT token string
 */
function generateToken(userId: string, expiresIn: number): string {
  const options: SignOptions = {
    expiresIn: expiresIn,
  };

  return jwt.sign({ userId }, jwtConfig.secret, options);
}

/**
 * Verify JWT token and extract payload
 * @param token - JWT token to verify
 * @returns Decoded token payload with userId or null if invalid
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, jwtConfig.secret) as { userId: string };
  } catch (error) {
    return null;
  }
}

/**
 * Generate JWT access token (1 hour expiration)
 * @param userId - User ID to include in token payload
 * @returns JWT access token string
 */
export function generateAccessToken(userId: string): string {
  return generateToken(userId, jwtConfig.accessTokenExpiresIn);
}

/**
 * Generate JWT refresh token (7 days expiration)
 * @param userId - User ID to include in token payload
 * @returns JWT refresh token string
 */
export function generateRefreshToken(userId: string): string {
  return generateToken(userId, jwtConfig.refreshTokenExpiresIn);
}