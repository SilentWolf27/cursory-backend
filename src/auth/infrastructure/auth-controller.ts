import type { Request, Response } from "express";
import { login } from "../application/login-use-case";
import { userRepository } from "./user-repository";
import { generateAccessToken, generateRefreshToken } from "./jwt-service";
import { ErrorFactory } from "../../commons/error/error-factory";
import { User } from "../domain/user";

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

  // Set tokens as HTTP-only cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 3600 * 1000, // 1 hour
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 3600 * 1000, // 7 days
  });

  res.status(200).json({
    user,
  });
}

/**
 * Handle user logout request
 * @param req - Express request object
 * @param res - Express response object
 */
export async function handleLogout(
  _req: Request,
  res: Response
): Promise<void> {
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
  if (!user) throw ErrorFactory.unauthorized("No valid session found");

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    isAuthenticated: true,
  });
}
