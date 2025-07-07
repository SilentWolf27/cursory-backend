import { prisma } from "../../config/prisma";

const REFRESH_TOKEN_SELECT = {
  id: true,
  token: true,
  userId: true,
  expiresAt: true,
  isRevoked: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Create a new refresh token
 * @param token - JWT refresh token
 * @param userId - User ID associated with the token
 * @param expiresAt - Token expiration date
 * @returns Created refresh token record
 */
export const createRefreshToken = (
  token: string,
  userId: string,
  expiresAt: Date
) => {
  return prisma.refreshToken.create({
    data: { token, userId, expiresAt },
    select: REFRESH_TOKEN_SELECT,
  });
};

/**
 * Find refresh token by token value
 * @param token - JWT refresh token to find
 * @returns Refresh token record or null if not found
 */
export const findRefreshTokenByToken = (token: string) => {
  return prisma.refreshToken.findUnique({
    where: { token },
    select: REFRESH_TOKEN_SELECT,
  });
};

/**
 * Revoke a refresh token
 * @param token - JWT refresh token to revoke
 * @returns Updated refresh token record
 */
export const revokeRefreshToken = (token: string, userId: string) => {
  return prisma.refreshToken.update({
    where: { token, userId },
    data: { isRevoked: true },
    select: REFRESH_TOKEN_SELECT,
  });
};