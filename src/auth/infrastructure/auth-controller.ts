import type { Request, Response } from "express";
import { login } from "../application/login-use-case";
import { userRepository } from "./user-repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "./jwt-service";
import { ErrorFactory } from "../../commons/error/error-factory";
import { User } from "../domain/user";
import {
  createRefreshToken,
  revokeRefreshToken,
  findRefreshTokenByToken,
} from "./refresh-token-repository";
import { jwtConfig } from "../../config/environment";

/**
 * Set access token cookie
 * @param res - Express response object
 * @param token - JWT access token
 */
function setAccessTokenCookie(res: Response, token: string): void {
  const isProduction = process.env["NODE_ENV"] === "production";
  
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: jwtConfig.accessTokenExpiresIn * 1000,
  });
}

/**
 * Set refresh token cookie
 * @param res - Express response object
 * @param token - JWT refresh token
 */
function setRefreshTokenCookie(res: Response, token: string): void {
  const isProduction = process.env["NODE_ENV"] === "production";
  
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: jwtConfig.refreshTokenExpiresIn * 1000,
  });
}

/**
 * Handle user login request
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const { user } = await login({ email, password }, userRepository);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const refreshTokenExpiresAt = new Date();
  refreshTokenExpiresAt.setSeconds(
    refreshTokenExpiresAt.getSeconds() + jwtConfig.refreshTokenExpiresIn
  );

  await createRefreshToken(refreshToken, user.id, refreshTokenExpiresAt);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    user,
  });
}

/**
 * Handle user logout request
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleLogout(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) throw ErrorFactory.unauthorized("No refresh token found");

  await revokeRefreshToken(refreshToken, user.id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Logged out successfully",
  });
}

/**
 * Get current user session
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleGetSession(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    session: {
      isAuthenticated: true,
      lastActivity: new Date().toISOString(),
    },
  });
}

/**
 * Handle token refresh request
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleRefresh(
  req: Request,
  res: Response
): Promise<void> {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken)
    throw ErrorFactory.unauthorized("Refresh token is required");

  const decoded = verifyToken(refreshToken);
  if (!decoded) throw ErrorFactory.unauthorized("Invalid refresh token");

  const tokenRecord = await findRefreshTokenByToken(refreshToken);
  if (!tokenRecord || tokenRecord.isRevoked)
    throw ErrorFactory.unauthorized("Refresh token is invalid or revoked");

  if (tokenRecord.expiresAt < new Date())
    throw ErrorFactory.unauthorized("Refresh token has expired");

  const newAccessToken = generateAccessToken(decoded.userId);

  setAccessTokenCookie(res, newAccessToken);

  res.status(200).json({
    message: "Token refreshed successfully",
  });
}
